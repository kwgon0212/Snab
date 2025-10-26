import { useState, useCallback } from "react";
import { DragEndEvent, DragOverEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

interface UseDragAndDropProps {
  allWindows: chrome.windows.Window[];
  fetchWindows: () => void;
  setAllWindows: React.Dispatch<React.SetStateAction<chrome.windows.Window[]>>;
}

export const useDragAndDrop = ({
  allWindows,
  fetchWindows,
  setAllWindows,
}: UseDragAndDropProps) => {
  const [activeTabId, setActiveTabId] = useState<number | null>(null);
  const [activeGroupTab, setActiveGroupTab] = useState<any | null>(null);

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
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
            if (!window.tabs || window.id !== draggedTab.windowId)
              return window;

            const oldIndex = window.tabs.findIndex(
              (tab) => tab.id === active.id
            );
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
    },
    [allWindows, setAllWindows]
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over || active.id === over.id) {
        setActiveTabId(null);
        fetchWindows();
        return;
      }

      // 그룹 관련 드래그인지 확인
      const isGroupDrag = active.id.toString().startsWith("sortable-tab-");

      if (isGroupDrag) {
        // 그룹 탭을 다른 그룹으로 드롭한 경우
        if (over.id.toString().startsWith("droppable-group-")) {
          try {
            const { loadWorkspaces, removeTabFromGroup, addTabToGroup } =
              await import("@/store/workspace");
            const workspaces = await loadWorkspaces();
            const activeWorkspace = workspaces[0];

            if (activeWorkspace) {
              const tabId = active.id.toString().replace("sortable-tab-", "");
              const targetGroupId = over.id
                .toString()
                .replace("droppable-group-", "");

              // 소스 그룹 찾기
              let sourceGroupId = "";
              let tabToMove = null;

              for (const group of activeWorkspace.groups) {
                const tab = group.tabs.find((t) => t.id === tabId);
                if (tab) {
                  sourceGroupId = group.id;
                  tabToMove = tab;
                  break;
                }
              }

              if (
                tabToMove &&
                sourceGroupId &&
                sourceGroupId !== targetGroupId
              ) {
                await addTabToGroup(
                  activeWorkspace.id,
                  targetGroupId,
                  tabToMove
                );
                await removeTabFromGroup(
                  activeWorkspace.id,
                  sourceGroupId,
                  tabId
                );
                window.dispatchEvent(new CustomEvent("workspace-updated"));
                setActiveTabId(null);
                setActiveGroupTab(null);
                return;
              }
            }
          } catch (error) {
            console.error("그룹 간 탭 이동 실패:", error);
          }
        }

        // 같은 그룹 내에서 탭 순서 변경인지 확인
        if (over.id.toString().startsWith("sortable-tab-")) {
          try {
            const { loadWorkspaces, reorderGroupTabs } = await import(
              "@/store/workspace"
            );
            const workspaces = await loadWorkspaces();
            const activeWorkspace = workspaces[0];

            if (activeWorkspace) {
              const activeTabIdStr = active.id
                .toString()
                .replace("sortable-tab-", "");
              const overTabIdStr = over.id
                .toString()
                .replace("sortable-tab-", "");

              for (const group of activeWorkspace.groups) {
                const activeTabIndex = group.tabs.findIndex(
                  (t) => t.id === activeTabIdStr
                );
                const overTabIndex = group.tabs.findIndex(
                  (t) => t.id === overTabIdStr
                );

                if (activeTabIndex !== -1 && overTabIndex !== -1) {
                  const reorderedTabs = [...group.tabs];
                  const [movedTab] = reorderedTabs.splice(activeTabIndex, 1);
                  reorderedTabs.splice(overTabIndex, 0, movedTab);

                  const newTabIds = reorderedTabs.map((t) => t.id);

                  await reorderGroupTabs(
                    activeWorkspace.id,
                    group.id,
                    newTabIds
                  );

                  window.dispatchEvent(new CustomEvent("workspace-updated"));
                  setActiveTabId(null);
                  setActiveGroupTab(null);
                  return;
                }
              }
            }
          } catch (error) {
            console.error("그룹 내 탭 순서 변경 실패:", error);
          }
        }

        // 그룹 탭을 윈도우로 드롭한 경우
        const overIdStr = over.id.toString();
        let targetWindowId: number | null = null;

        if (overIdStr.startsWith("window-")) {
          targetWindowId = parseInt(overIdStr.replace("window-", ""));
        } else if (!isNaN(parseInt(overIdStr))) {
          const numId = parseInt(overIdStr);

          const isTab = allWindows.some((w) =>
            w.tabs?.some((t) => t.id === numId)
          );

          if (!isTab) {
            targetWindowId = numId;
          } else {
            for (const w of allWindows) {
              if (w.tabs?.some((t) => t.id === numId)) {
                targetWindowId = w.id || null;
                break;
              }
            }
          }
        }

        if (targetWindowId !== null) {
          const tabId = active.id.toString().replace("sortable-tab-", "");

          try {
            const { loadWorkspaces, removeTabFromGroup } = await import(
              "@/store/workspace"
            );
            const workspaces = await loadWorkspaces();
            const activeWorkspace = workspaces[0];

            if (activeWorkspace) {
              for (const group of activeWorkspace.groups) {
                const tab = group.tabs.find((t) => t.id === tabId);
                if (tab) {
                  try {
                    await chrome.windows.get(targetWindowId);
                    await chrome.tabs.create({
                      url: tab.url,
                      windowId: targetWindowId,
                      active: false,
                    });
                    await removeTabFromGroup(
                      activeWorkspace.id,
                      group.id,
                      tabId
                    );
                    window.dispatchEvent(new CustomEvent("workspace-updated"));
                  } catch (windowError) {
                    console.error("윈도우 접근 실패:", windowError);
                    const currentWindow = await chrome.windows.getCurrent();
                    await chrome.tabs.create({
                      url: tab.url,
                      windowId: currentWindow.id,
                      active: false,
                    });
                    await removeTabFromGroup(
                      activeWorkspace.id,
                      group.id,
                      tabId
                    );
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
        setActiveGroupTab(null);
        return;
      }

      // 윈도우 탭 드래그 처리
      const draggedTab = allWindows
        .flatMap((w) => w.tabs || [])
        .find((tab) => tab.id === active.id);

      if (!draggedTab) {
        console.error("드래그된 탭을 찾을 수 없습니다");
        setActiveTabId(null);
        setActiveGroupTab(null);
        return;
      }

      // 그룹으로 드롭된 경우
      if (over.id.toString().startsWith("droppable-group-")) {
        const groupId = over.id.toString().replace("droppable-group-", "");

        try {
          const { loadWorkspaces, addTabToGroup } = await import(
            "@/store/workspace"
          );
          const workspaces = await loadWorkspaces();
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

            try {
              await chrome.tabs.remove(active.id as number);
            } catch (error) {
              console.error("탭 닫기 실패:", error);
            }

            window.dispatchEvent(new CustomEvent("workspace-updated"));
          }
        } catch (error) {
          console.error("탭을 그룹에 추가 실패:", error);
        }

        setActiveTabId(null);
        setActiveGroupTab(null);
        return;
      }

      // 윈도우 간 이동
      if (over.id.toString().startsWith("window-")) {
        const targetWindowId = parseInt(
          over.id.toString().replace("window-", "")
        );

        try {
          await chrome.tabs.move(active.id as number, {
            windowId: targetWindowId,
            index: -1,
          });
          fetchWindows();
        } catch (error) {
          console.error("탭 이동 실패:", error);
          fetchWindows();
        }
      } else {
        // 같은 윈도우 내 순서 변경
        try {
          const targetTab = allWindows
            .flatMap((w) => w.tabs || [])
            .find((tab) => tab.id === over.id);

          if (targetTab) {
            const targetIndex = targetTab.index || 0;
            await chrome.tabs.move(active.id as number, {
              windowId: draggedTab.windowId,
              index: targetIndex,
            });
            fetchWindows();
          }
        } catch (error) {
          console.error("탭 순서 변경 실패:", error);
          fetchWindows();
        }
      }

      setActiveTabId(null);
      setActiveGroupTab(null);
    },
    [allWindows, fetchWindows, setAllWindows]
  );

  const handleDragStart = useCallback(async (event: any) => {
    setActiveTabId(event.active.id);

    if (event.active.id.toString().startsWith("sortable-tab-")) {
      try {
        const { loadWorkspaces } = await import("@/store/workspace");
        const workspaces = await loadWorkspaces();
        const activeWorkspace = workspaces[0];

        if (activeWorkspace) {
          const tabId = event.active.id.toString().replace("sortable-tab-", "");

          for (const group of activeWorkspace.groups) {
            const tab = group.tabs.find((t) => t.id === tabId);
            if (tab) {
              setActiveGroupTab(tab);
              break;
            }
          }
        }
      } catch (error) {
        console.error("그룹 탭 정보 로드 실패:", error);
      }
    } else {
      setActiveGroupTab(null);
    }
  }, []);

  return {
    activeTabId,
    activeGroupTab,
    handleDragOver,
    handleDragEnd,
    handleDragStart,
  };
};
