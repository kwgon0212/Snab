import { useEffect, useState } from "react";
import { loadAllWindows } from "@/utils/windows";
import Header from "./components/Header";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import Window from "./components/Window";
import { Plus } from "lucide-react";
import Bookmark from "./components/Bookmark";
import Workspace from "./components/workspace/Workspace";
import { cn } from "@/utils/cn";

export default function App() {
  const [allWindows, setAllWindows] = useState<chrome.windows.Window[]>([]);
  const [activeTabId, setActiveTabId] = useState<number | null>(null);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isResizing]);

  const handleDragStart = (event: any) => {
    setActiveTabId(event.active.id);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    // 같은 윈도우 내에서 탭 순서 변경인지 확인
    const draggedTab = allWindows
      .flatMap((w) => w.tabs || [])
      .find((tab) => tab.id === active.id);

    const targetTab = allWindows
      .flatMap((w) => w.tabs || [])
      .find((tab) => tab.id === over.id);

    if (!draggedTab || !targetTab) return;

    // 같은 윈도우 내에서만 실시간 UI 업데이트
    if (draggedTab.windowId === targetTab.windowId) {
      setAllWindows((windows) => {
        return windows.map((window) => {
          if (!window.tabs || window.id !== draggedTab.windowId) return window;

          const oldIndex = window.tabs.findIndex((tab) => tab.id === active.id);
          const newIndex = window.tabs.findIndex((tab) => tab.id === over.id);

          if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
            return {
              ...window,
              tabs: arrayMove(window.tabs, oldIndex, newIndex),
            };
          }

          return window;
        });
      });
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      setActiveTabId(null);
      // 드래그가 취소된 경우 원래 상태로 복원
      fetchWindows();
      return;
    }

    console.log("Drag ended:", {
      active: active.id,
      over: over.id,
      overType: typeof over.id,
      overString: over.id.toString(),
    });

    // 그룹 관련 드래그인지 확인
    const isGroupDrag = active.id.toString().startsWith("sortable-tab-");

    if (isGroupDrag) {
      // 그룹 탭을 윈도우로 드롭한 경우
      const overIdStr = over.id.toString();
      let targetWindowId: number | null = null;

      console.log(
        "그룹 드래그 - over.id:",
        over.id,
        "over.id 타입:",
        typeof over.id
      );

      if (overIdStr.startsWith("window-")) {
        // window- prefix가 있는 경우
        targetWindowId = parseInt(overIdStr.replace("window-", ""));
      } else if (!isNaN(parseInt(overIdStr))) {
        // 숫자인 경우 - 윈도우 ID인지 탭 ID인지 확인
        const numId = parseInt(overIdStr);

        // allWindows에서 해당 ID가 탭인지 윈도우인지 확인
        const isTab = allWindows.some((w) =>
          w.tabs?.some((t) => t.id === numId)
        );

        if (!isTab) {
          // 탭이 아니면 윈도우 ID로 취급
          targetWindowId = numId;
        } else {
          // 탭인 경우, 해당 탭이 속한 윈도우 찾기
          for (const w of allWindows) {
            if (w.tabs?.some((t) => t.id === numId)) {
              targetWindowId = w.id || null;
              break;
            }
          }
        }
      }

      console.log("추출된 윈도우 ID:", targetWindowId);

      if (targetWindowId !== null) {
        const tabId = active.id.toString().replace("sortable-tab-", "");

        try {
          // 워크스페이스에서 탭 찾기
          const { loadWorkspaces, removeTabFromGroup } = await import(
            "@/store/workspace"
          );
          const workspaces = await loadWorkspaces();
          const activeWorkspace = workspaces[0];

          if (activeWorkspace) {
            // 탭을 찾고 그룹에서 제거
            for (const group of activeWorkspace.groups) {
              const tab = group.tabs.find((t) => t.id === tabId);
              if (tab) {
                // 윈도우가 실제로 존재하는지 확인
                try {
                  await chrome.windows.get(targetWindowId);

                  // 윈도우에 탭 추가
                  await chrome.tabs.create({
                    url: tab.url,
                    windowId: targetWindowId,
                    active: false,
                  });

                  // 그룹에서 탭 제거
                  await removeTabFromGroup(activeWorkspace.id, group.id, tabId);

                  // 워크스페이스 업데이트 이벤트 발생
                  window.dispatchEvent(new CustomEvent("workspace-updated"));
                } catch (windowError) {
                  console.error("윈도우 접근 실패:", windowError);
                  // 윈도우가 없으면 현재 포커스된 윈도우에 추가
                  const currentWindow = await chrome.windows.getCurrent();
                  await chrome.tabs.create({
                    url: tab.url,
                    windowId: currentWindow.id,
                    active: false,
                  });
                  await removeTabFromGroup(activeWorkspace.id, group.id, tabId);
                  window.dispatchEvent(new CustomEvent("workspace-updated"));
                }
                break;
              }
            }
          }
        } catch (error) {
          console.error("그룹에서 윈도우로 탭 이동 실패:", error);
        }
      }

      setActiveTabId(null);
      return;
    }

    // 드래그된 탭 정보 찾기 (윈도우 탭들만)
    const draggedTab = allWindows
      .flatMap((w) => w.tabs || [])
      .find((tab) => tab.id === active.id);

    if (!draggedTab) {
      console.error("드래그된 탭을 찾을 수 없습니다");
      setActiveTabId(null);
      return;
    }

    console.log("드래그된 탭:", draggedTab);

    // 그룹으로 드롭된 경우
    if (over.id.toString().startsWith("droppable-group-")) {
      console.log("그룹으로 드롭 감지됨");
      const groupId = over.id.toString().replace("droppable-group-", "");

      try {
        // 워크스페이스 데이터 로드
        const { loadWorkspaces, addTabToGroup } = await import(
          "@/store/workspace"
        );
        const workspaces = await loadWorkspaces();

        // 현재 활성 워크스페이스 찾기 (첫 번째 워크스페이스 사용)
        const activeWorkspace = workspaces[0];
        if (activeWorkspace) {
          const tabData = {
            id: `group-${Date.now()}-${Math.random()
              .toString(36)
              .substr(2, 9)}`,
            originalId: draggedTab.id!,
            title: draggedTab.title || "",
            url: draggedTab.url || "",
            favIconUrl: draggedTab.favIconUrl,
            windowId: draggedTab.windowId!,
          };

          await addTabToGroup(activeWorkspace.id, groupId, tabData);
          console.log("탭이 그룹에 추가되었습니다");

          // 탭을 닫기
          try {
            await chrome.tabs.remove(active.id as number);
            console.log("탭이 닫혔습니다");
          } catch (error) {
            console.error("탭 닫기 실패:", error);
          }

          // 워크스페이스 데이터 새로고침을 위한 이벤트 발생
          window.dispatchEvent(new CustomEvent("workspace-updated"));
        }
      } catch (error) {
        console.error("탭을 그룹에 추가 실패:", error);
      }

      setActiveTabId(null);
      return;
    }

    // 윈도우로 드롭된 경우 (윈도우 간 이동) - 우선 처리
    if (over.id.toString().startsWith("window-")) {
      console.log("윈도우로 드롭 감지됨");
      const targetWindowId = parseInt(
        over.id.toString().replace("window-", "")
      );

      console.log(
        `현재 윈도우: ${draggedTab.windowId}, 대상 윈도우: ${targetWindowId}`
      );

      if (draggedTab.windowId !== targetWindowId) {
        try {
          console.log(`탭 ${active.id}을 윈도우 ${targetWindowId}로 이동`);

          // 탭을 다른 윈도우로 이동
          await chrome.tabs.move(active.id as number, {
            windowId: targetWindowId,
            index: -1, // 맨 끝에 추가
          });

          console.log("탭 이동 완료");

          // UI 상태 업데이트
          fetchWindows();
        } catch (error) {
          console.error("탭 이동 실패:", error);
          fetchWindows();
        }
      } else {
        console.log("같은 윈도우로 드롭됨 - 이동하지 않음");
      }
    } else if (over.id && !over.id.toString().startsWith("window-")) {
      // 탭으로 드롭된 경우
      const targetTab = allWindows
        .flatMap((w) => w.tabs || [])
        .find((tab) => tab.id === over.id);

      if (targetTab) {
        // 다른 윈도우의 탭으로 드롭된 경우 (윈도우 간 이동)
        if (draggedTab.windowId !== targetTab.windowId) {
          try {
            console.log(
              `탭 ${active.id}을 윈도우 ${targetTab.windowId}로 이동 (탭 위로 드롭)`
            );

            // 탭을 다른 윈도우로 이동
            await chrome.tabs.move(active.id as number, {
              windowId: targetTab.windowId,
              index: targetTab.index || 0,
            });

            fetchWindows();
          } catch (error) {
            console.error("탭 이동 실패:", error);
            fetchWindows();
          }
        } else {
          // 같은 윈도우 내 순서 변경
          try {
            console.log(`탭 ${active.id}을 탭 ${over.id} 위치로 이동`);

            // Chrome API를 사용하여 실제 탭 순서 변경
            const targetIndex = targetTab.index || 0;
            await chrome.tabs.move(active.id as number, {
              windowId: draggedTab.windowId,
              index: targetIndex,
            });

            fetchWindows();
          } catch (error) {
            console.error("탭 순서 변경 실패:", error);
            fetchWindows();
          }
        }
      }
    }

    // 드래그 종료 시 activeTabId 초기화
    setActiveTabId(null);
  };

  const handleCreateWindow = async () => {
    await chrome.windows.create({});
    fetchWindows();
  };

  useEffect(() => {
    // 초기 로드
    fetchWindows();

    // 탭 생성 시 자동 업데이트
    chrome.tabs.onCreated.addListener(fetchWindows);
    // 탭 업데이트 시 자동 업데이트
    chrome.tabs.onUpdated.addListener(fetchWindows);
    // 탭 제거 시 자동 업데이트
    chrome.tabs.onRemoved.addListener(fetchWindows);
    // 윈도우 상태 변경 시 자동 업데이트 (전체화면, 최소화 등)
    chrome.windows.onBoundsChanged.addListener(fetchWindows);
    chrome.windows.onFocusChanged.addListener(fetchWindows);

    // cleanup: 컴포넌트 unmount 시 리스너 제거
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
      <Header />

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

          {/* 리사이즈 핸들 */}
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
          {activeTabId ? (
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
