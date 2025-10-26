import { useState, useEffect } from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Bookmark,
  ChevronDown,
  Maximize2,
  Minimize,
  Minimize2,
  X,
} from "lucide-react";
import Link from "./Link";
import { cn } from "@/utils/cn";
import { closeWindow, minimizeWindow } from "@/utils/windows";
import { useDroppable } from "@dnd-kit/core";
import {
  toggleBookmark,
  isBookmarked,
  type BookmarkData,
} from "@/store/bookmark";

interface WindowProps {
  window: chrome.windows.Window;
  index: number;
}

const Window = ({ window, index }: WindowProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [bookmarkedUrls, setBookmarkedUrls] = useState<Set<string>>(new Set());

  const { setNodeRef, isOver } = useDroppable({ id: `window-${window.id}` });

  // 북마크 상태 불러오기 함수
  const loadBookmarkStates = async () => {
    if (window.tabs) {
      const bookmarkStates = await Promise.all(
        window.tabs.map(async (tab) => {
          const isBooked = await isBookmarked(tab.url || "");
          return { url: tab.url || "", isBooked };
        })
      );

      const bookmarkedUrls = new Set(
        bookmarkStates
          .filter((state) => state.isBooked)
          .map((state) => state.url)
      );

      setBookmarkedUrls(bookmarkedUrls);
    }
  };

  // 컴포넌트 마운트 시 북마크 상태 불러오기
  useEffect(() => {
    loadBookmarkStates();

    // 북마크 변경 이벤트 리스너 추가
    const handleStorageChange = (changes: {
      [key: string]: chrome.storage.StorageChange;
    }) => {
      if (changes.bookmarks) {
        loadBookmarkStates();
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, [window.tabs]);

  const handleCloseTab = (tabId: number) => {
    chrome.tabs.remove(tabId);
  };

  const handleClickTab = async (tabId: number) => {
    try {
      // 탭 활성화
      await chrome.tabs.update(tabId, { active: true });

      // 해당 탭이 속한 윈도우 찾기
      const tab = await chrome.tabs.get(tabId);
      if (tab.windowId) {
        // 윈도우 포커스
        await chrome.windows.update(tab.windowId, { focused: true });
      }
    } catch (error) {
      console.error("탭 클릭 실패:", error);
    }
  };

  const handleBookmark = async (e: React.MouseEvent, tab: chrome.tabs.Tab) => {
    e.stopPropagation();
    e.preventDefault();

    const bookmarkData: BookmarkData = {
      url: tab.url || "",
      title: tab.title || "",
      faviconUrl: tab.favIconUrl || "",
    };

    try {
      const isBooked = await toggleBookmark(bookmarkData);
      setBookmarkedUrls((prev) => {
        const newSet = new Set(prev);
        if (isBooked) {
          newSet.add(tab.url || "");
        } else {
          newSet.delete(tab.url || "");
        }
        return newSet;
      });
    } catch (error) {
      console.error("북마크 토글 실패:", error);
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "rounded-lg",
        window.focused
          ? "border-blue-300 border-2"
          : "border-slate-300 border-1",
        isOver && "bg-blue-50 border-1 border-blue-300 border-dashed"
      )}
    >
      {/* 아코디언 헤더 */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer bg-white"
      >
        <div className="w-full min-w-0 flex justify-between items-center cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
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
              "transition-transform duration-300 cursor-pointer text-slate-400",
              isExpanded ? "rotate-180" : ""
            )}
          />
        </div>
      </div>

      {/* 아코디언 컨텐츠 */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out bg-slate-100 rounded-b-md",
          isExpanded ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        {window.tabs && window.tabs.length > 0 ? (
          <SortableContext
            items={window.tabs?.map((tab) => tab.id?.toString() || "") || []}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-1 p-2">
              {window.tabs?.map((tab) => (
                <Link
                  key={tab.id}
                  id={tab.id!}
                  onClick={() => handleClickTab(tab.id!)}
                  className="flex items-center gap-2 w-full bg-white hover:shadow-sm px-4 py-2 transition-shadow duration-500 rounded-md relative group cursor-pointer"
                >
                  {tab.favIconUrl ? (
                    <img
                      src={tab.favIconUrl}
                      alt={tab.title}
                      className="size-4 rounded-sm"
                    />
                  ) : (
                    <div className="size-4 rounded-sm flex items-center justify-center">
                      <span className="text-sm">🌐</span>
                    </div>
                  )}
                  <span className="text-sm truncate">{tab.title}</span>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2">
                    <button onClick={(e) => handleBookmark(e, tab)}>
                      <Bookmark
                        className={cn(
                          "size-4 hover:scale-120 transition-all duration-300",
                          bookmarkedUrls.has(tab.url || "")
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-blue-400 hover:text-blue-600"
                        )}
                        fill={
                          bookmarkedUrls.has(tab.url || "")
                            ? "currentColor"
                            : "none"
                        }
                        strokeWidth={1.5}
                      />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCloseTab(tab.id!);
                      }}
                    >
                      <X
                        className="size-4 text-blue-400 hover:text-blue-600 hover:scale-120 transition-all duration-300"
                        strokeWidth={1.5}
                      />
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </SortableContext>
        ) : (
          <div className="flex items-center justify-center h-full min-h-[100px]">
            <div className="text-center p-4">
              <div className="text-sm text-gray-500 mb-2">탭이 없습니다</div>
              <div className="text-xs text-gray-400">
                다른 윈도우에서 탭을 여기로 드래그하여 이동할 수 있습니다
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CloseButton = ({ windowId }: { windowId: number }) => {
  const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    closeWindow(windowId);
  };
  return (
    <button
      onClick={handleClose}
      className="size-3.5 rounded-full bg-red-400 hover:bg-red-500 hover:scale-120 transition-all duration-300 flex items-center justify-center group"
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
      className="size-3.5 rounded-full bg-yellow-400 hover:bg-yellow-500 hover:scale-120 transition-all duration-300 flex items-center justify-center group"
    >
      <Minimize className="size-2 text-yellow-800 opacity-0 group-hover:opacity-100 transition-all duration-300" />
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
      className="size-3.5 rounded-full bg-green-400 hover:bg-green-500 hover:scale-120 transition-all duration-300 flex items-center justify-center group"
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
export default Window;
