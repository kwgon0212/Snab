import { loadAllWindows } from "@/utils/windows";
import { useEffect, useState } from "react";

export default function useAllWindows() {
  const [allWindows, setAllWindows] = useState<chrome.windows.Window[]>([]);

  const fetchWindows = async () => {
    const windows = await loadAllWindows();
    setAllWindows(windows);
  };

  useEffect(() => {
    fetchWindows();

    // onUpdated 리스너 함수 정의 (제거를 위해 참조 저장 필요)
    const handleTabUpdated = (
      _tabId: number,
      changeInfo: chrome.tabs.OnUpdatedInfo,
      _tab: chrome.tabs.Tab
    ) => {
      // 탭이 완전히 로드되었을 때만 업데이트 (파비콘 포함)
      if (changeInfo.status === "complete") {
        fetchWindows();
      }
    };

    // 이벤트 리스너 등록
    chrome.tabs.onCreated.addListener(fetchWindows);
    chrome.tabs.onRemoved.addListener(fetchWindows);
    chrome.tabs.onUpdated.addListener(handleTabUpdated);
    chrome.windows.onCreated.addListener(fetchWindows);
    chrome.windows.onRemoved.addListener(fetchWindows);
    chrome.windows.onBoundsChanged.addListener(fetchWindows);
    chrome.windows.onFocusChanged.addListener(fetchWindows);

    // 정리 함수
    return () => {
      chrome.tabs.onCreated.removeListener(fetchWindows);
      chrome.tabs.onRemoved.removeListener(fetchWindows);
      chrome.tabs.onUpdated.removeListener(handleTabUpdated);
      chrome.windows.onCreated.removeListener(fetchWindows);
      chrome.windows.onRemoved.removeListener(fetchWindows);
      chrome.windows.onBoundsChanged.removeListener(fetchWindows);
      chrome.windows.onFocusChanged.removeListener(fetchWindows);
    };
  }, []);

  return { allWindows, fetchWindows, setAllWindows };
}
