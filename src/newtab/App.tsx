import { useEffect, useState } from "react";
import { loadAllWindows } from "@/utils/windows";
import Header from "./components/Header";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import Window from "./components/Window";
import { Plus } from "lucide-react";
import Bookmark from "./components/Bookmark";
import Workspace from "./components/workspace/Workspace";
import { useDragAndDrop } from "./hooks/useDragAndDrop";
import { useSnapshot } from "./hooks/useSnapshot";

export default function App() {
  const [allWindows, setAllWindows] = useState<chrome.windows.Window[]>([]);
  const [rightPanelWidth, setRightPanelWidth] = useState(400);
  const [isResizing, setIsResizing] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const fetchWindows = async () => {
    const windows = await loadAllWindows();
    setAllWindows(windows);
  };

  // 커스텀 훅 사용
  const {
    activeTabId,
    activeGroupTab,
    handleDragOver,
    handleDragEnd,
    handleDragStart,
  } = useDragAndDrop({
    allWindows,
    fetchWindows,
    setAllWindows,
  });

  const {
    closeWindowsAfterSnapshot,
    handleSnapshot,
    handleToggleCloseWindows,
  } = useSnapshot({
    allWindows,
    fetchWindows,
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;

    const newWidth = window.innerWidth - e.clientX;
    const minWidth = 300;
    const maxWidth = 600;

    if (newWidth >= minWidth && newWidth <= maxWidth) {
      setRightPanelWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  const handleCreateWindow = async () => {
    await chrome.windows.create({});
    fetchWindows();
  };

  useEffect(() => {
    fetchWindows();

    chrome.tabs.onCreated.addListener(fetchWindows);
    chrome.tabs.onUpdated.addListener(fetchWindows);
    chrome.tabs.onRemoved.addListener(fetchWindows);
    chrome.windows.onBoundsChanged.addListener(fetchWindows);
    chrome.windows.onFocusChanged.addListener(fetchWindows);

    return () => {
      chrome.tabs.onCreated.removeListener(fetchWindows);
      chrome.tabs.onUpdated.removeListener(fetchWindows);
      chrome.tabs.onRemoved.removeListener(fetchWindows);
      chrome.windows.onBoundsChanged.removeListener(fetchWindows);
      chrome.windows.onFocusChanged.removeListener(fetchWindows);
    };
  }, []);

  return (
    <div className="w-screen h-screen min-w-[1000px] flex flex-col overflow-hidden">
      <Header
        onSnapshot={handleSnapshot}
        closeWindowsAfterSnapshot={closeWindowsAfterSnapshot}
        onToggleCloseWindows={handleToggleCloseWindows}
      />

      <DndContext
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        sensors={sensors}
        collisionDetection={closestCenter}
      >
        <main className="flex w-full flex-1 min-h-0">
          <section className="flex-1 h-full min-w-0 flex flex-col">
            <Bookmark />
            <Workspace />
          </section>

          <div
            className="w-[1px] bg-slate-300 hover:bg-blue-400 cursor-col-resize transition-all duration-300 z-30 relative"
            onMouseDown={handleMouseDown}
          />

          <section
            className="relative z-20 shrink-0 h-full flex flex-col gap-3 overflow-hidden p-5 bg-white"
            style={{ width: `${rightPanelWidth}px` }}
          >
            <span className="text-slate-500">
              총 {allWindows.length}개의 윈도우
            </span>
            <div className="flex-1 overflow-y-auto flex flex-col gap-4 pb-5">
              {allWindows.map((window, idx) => (
                <Window key={window.id} window={window} index={idx} />
              ))}
            </div>
            <div className="shrink-0">
              <button
                onClick={handleCreateWindow}
                className="flex w-full justify-center items-center gap-2 bg-blue-500 hover:bg-blue-600 active:scale-95 px-4 py-2 transition-all duration-200 rounded-md text-white shadow-sm hover:shadow-md"
              >
                <Plus className="size-4" />
                <span>새 윈도우</span>
              </button>
            </div>
          </section>
        </main>

        <DragOverlay>
          {activeGroupTab ? (
            <div className="flex items-center gap-2 bg-white p-2 rounded-md hover:bg-slate-50 shadow-lg opacity-90 min-w-[200px]">
              {activeGroupTab.favIconUrl ? (
                <img
                  src={activeGroupTab.favIconUrl}
                  alt=""
                  className="size-4 rounded-sm flex-shrink-0"
                  style={{
                    filter:
                      "drop-shadow(0 0 0.1px rgba(0,0,0,0.6)) drop-shadow(0 0 1px rgba(0,0,0,0.35))",
                  }}
                />
              ) : (
                <div className="size-4 rounded-sm bg-slate-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs">🌐</span>
                </div>
              )}
              <span className="text-sm truncate">{activeGroupTab.title}</span>
            </div>
          ) : activeTabId ? (
            <div className="flex items-center gap-2 w-full bg-white p-2 rounded-md shadow-lg opacity-90">
              {allWindows
                .flatMap((w) => w.tabs || [])
                .find((t) => t.id === activeTabId)?.favIconUrl ? (
                <img
                  src={
                    allWindows
                      .flatMap((w) => w.tabs || [])
                      .find((t) => t.id === activeTabId)?.favIconUrl
                  }
                  alt=""
                  className="size-4 rounded-sm"
                  style={{
                    filter:
                      "drop-shadow(0 0 0.1px rgba(0,0,0,0.6)) drop-shadow(0 0 1px rgba(0,0,0,0.35))",
                  }}
                />
              ) : (
                <div className="size-4 rounded-sm flex items-center justify-center">
                  <span className="text-sm">🌐</span>
                </div>
              )}
              <span className="text-sm truncate">
                {
                  allWindows
                    .flatMap((w) => w.tabs || [])
                    .find((t) => t.id === activeTabId)?.title
                }
              </span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
