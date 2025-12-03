import { cn } from "@/utils/cn";
import { useDroppable, useDndContext } from "@dnd-kit/core";
import Tab from "./Tab";
import { useState } from "react";
import { closeWindow, minimizeWindow } from "@/utils/windows";
import {
  ChevronDown,
  CornerRightDown,
  Maximize2,
  Minimize2,
  Minus,
  X,
} from "lucide-react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

const BrowserUI = ({
  window,
  index,
}: {
  window: chrome.windows.Window;
  index: number;
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { setNodeRef, isOver } = useDroppable({
    id: `window-${window.id}`,
    data: {
      type: "window",
      id: window.id!,
      tabs: window.tabs!,
    },
  });

  const { active } = useDndContext();
  const activeOrigin = active?.data.current?.origin;

  // 같은 origin(같은 윈도우)에서 드래그하면 오버레이 숨김
  const shouldShowOverlay =
    isOver &&
    (!activeOrigin ||
      activeOrigin.type !== "window" ||
      activeOrigin.id !== window.id!.toString());

  return (
    <SortableContext
      items={
        window.tabs
          ?.map((tab) => `window-${window.id}-tab-${tab.id}`)
          .filter(Boolean) || []
      }
      strategy={verticalListSortingStrategy}
    >
      <div
        ref={setNodeRef}
        className={cn(
          "rounded-lg relative",
          window.focused
            ? "border-blue-400 border-1"
            : "border-slate-300 border-1",
          shouldShowOverlay && "bg-blue-50 border-blue-500 border-dashed z-[5]"
        )}
      >
        <div
          className={cn(
            "absolute text-blue-500 flex items-center justify-center text-center top-0 left-0 w-full h-full bg-blue-50/90 z-10 transition-all duration-200",
            shouldShowOverlay
              ? "opacity-100 pointer-events-auto scale-100"
              : "opacity-0 pointer-events-none scale-95"
          )}
        >
          <p className="text-sm flex items-center gap-2">
            여기에 탭을 Drop하세요
            <CornerRightDown className="size-4" />
          </p>
        </div>
        {/* 아코디언 헤더 */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "w-full flex items-center justify-between px-3 py-2 rounded-t-lg hover:bg-gray-50 transition-colors cursor-pointer bg-white",
            isExpanded ? "rounded-b-none" : "rounded-b-lg"
          )}
        >
          <div className="w-full min-w-0 flex justify-between items-center cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="intro-browser-header-buttons flex items-center gap-2">
                <CloseButton windowId={window.id!} />
                <MinimizeButton windowId={window.id!} />
                <FullscreenToggleButton
                  windowId={window.id!}
                  windowState={window.state!}
                />
              </div>
              <h3 className="text-base text-slate-500 truncate">{`윈도우 #${
                index + 1
              }`}</h3>
            </div>

            <ChevronDown
              className={cn(
                "transition-transform duration-300 cursor-pointer text-slate-400 size-5",
                isExpanded ? "rotate-180" : ""
              )}
            />
          </div>
        </div>

        {/* 아코디언 컨텐츠 */}
        <div
          className={cn(
            "w-full p-2 flex flex-col gap-2 overflow-y-auto transition-all duration-250 ease-in-out bg-slate-100 rounded-b-md",
            isExpanded ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0 p-0"
          )}
        >
          {window.tabs && window.tabs.length > 0 ? (
            <>
              {window.tabs.map((tab) => (
                <Tab
                  key={tab.id!}
                  id={`window-${window.id}-tab-${tab.id}`}
                  onClick={() => {
                    chrome.windows.update(window.id!, { focused: true });
                    chrome.tabs.update(tab.id!, { active: true });
                  }}
                  tabInfo={tab}
                  className="intro-browser-tab"
                  origin={{ type: "window", id: window.id!.toString() }}
                />
              ))}
            </>
          ) : (
            <div className="flex items-center justify-center h-full py-5">
              <span className="text-slate-500">No tabs</span>
            </div>
          )}
        </div>
      </div>
    </SortableContext>
  );
};

export default BrowserUI;

const CloseButton = ({ windowId }: { windowId: number }) => {
  const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    closeWindow(windowId);
  };
  return (
    <button
      onClick={handleClose}
      className="size-3 rounded-full bg-red-400 hover:bg-red-500 hover:scale-120 transition-all duration-300 flex items-center justify-center group"
    >
      <X className="size-2 text-red-800 opacity-0 group-hover:opacity-100 transition-all duration-300" />
    </button>
  );
};

const MinimizeButton = ({ windowId }: { windowId: number }) => {
  const handleMinimize = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    minimizeWindow(windowId);
  };
  return (
    <button
      onClick={handleMinimize}
      className="size-3 rounded-full bg-yellow-400 hover:bg-yellow-500 hover:scale-120 transition-all duration-300 flex items-center justify-center group"
    >
      <Minus className="size-2 text-yellow-800 opacity-0 group-hover:opacity-100 transition-all duration-300" />
    </button>
  );
};

const FullscreenToggleButton = ({
  windowId,
  windowState,
}: {
  windowId: number;
  windowState: chrome.windows.Window["state"];
}) => {
  const isFullscreen = windowState === "fullscreen";

  const handleToggleFullscreen = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    e.preventDefault();

    if (isFullscreen) {
      await chrome.windows.update(windowId, { state: "maximized" });
    } else {
      await chrome.windows.update(windowId, { state: "fullscreen" });
    }
  };

  return (
    <button
      onClick={handleToggleFullscreen}
      className="size-3 rounded-full bg-green-400 hover:bg-green-500 hover:scale-120 transition-all duration-300 flex items-center justify-center group"
      aria-label={isFullscreen ? "전체화면 해제" : "전체화면"}
      title={isFullscreen ? "전체화면 해제" : "전체화면"}
    >
      {isFullscreen ? (
        <Minimize2 className="size-2 text-green-800 opacity-0 group-hover:opacity-100 transition-all duration-300" />
      ) : (
        <Maximize2 className="size-2 text-green-800 opacity-0 group-hover:opacity-100 transition-all duration-300" />
      )}
    </button>
  );
};
