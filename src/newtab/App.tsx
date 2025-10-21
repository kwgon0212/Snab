import { useEffect, useState } from "react";
import { loadAllWindows } from "../../utils/windows";
import WindowLists from "./components/WindowLists";
import AddWindow from "./components/AddWindow";

export default function App() {
  const [allWindows, setAllWindows] = useState<chrome.windows.Window[]>([]);

  const fetchWindows = async () => {
    const windows = await loadAllWindows();
    console.log("loadAllWindows", windows);
    setAllWindows(windows);
  };

  useEffect(() => {
    // 초기 로드
    fetchWindows();

    // 탭 생성 시 자동 업데이트
    const handleTabCreated = () => {
      console.log("Tab created");
      fetchWindows();
    };

    // 탭 업데이트 시 자동 업데이트
    const handleTabUpdated = () => {
      console.log("Tab updated");
      fetchWindows();
    };

    // 탭 제거 시 자동 업데이트
    const handleTabRemoved = () => {
      console.log("Tab removed");
      fetchWindows();
    };

    // 윈도우 상태 변경 시 자동 업데이트 (전체화면, 최소화 등)
    const handleWindowChanged = () => {
      console.log("Window changed");
      fetchWindows();
    };

    // 이벤트 리스너 등록
    chrome.tabs.onCreated.addListener(handleTabCreated);
    chrome.tabs.onUpdated.addListener(handleTabUpdated);
    chrome.tabs.onRemoved.addListener(handleTabRemoved);
    chrome.windows.onBoundsChanged.addListener(handleWindowChanged);
    chrome.windows.onFocusChanged.addListener(handleWindowChanged);

    // cleanup: 컴포넌트 unmount 시 리스너 제거
    return () => {
      chrome.tabs.onCreated.removeListener(handleTabCreated);
      chrome.tabs.onUpdated.removeListener(handleTabUpdated);
      chrome.tabs.onRemoved.removeListener(handleTabRemoved);
      chrome.windows.onBoundsChanged.removeListener(handleWindowChanged);
      chrome.windows.onFocusChanged.removeListener(handleWindowChanged);
    };
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden">
      <header className="w-full h-20 bg-black/50 shrink-0">123</header>
      <main className="grid grid-cols-[7fr_3fr] gap-5 w-full flex-1 p-5 min-h-0">
        <section className="bg-black/10 h-full min-w-0"></section>

        <section className="h-full min-w-0 flex flex-col gap-2 overflow-hidden">
          <div className="flex-1 overflow-y-auto flex flex-col gap-2">
            <span className="text-slate-500">
              총 {allWindows.length}개의 윈도우
            </span>
            <WindowLists windows={allWindows} />
          </div>

          <div className="shrink-0">
            <AddWindow />
          </div>
        </section>
      </main>
    </div>
  );
}
