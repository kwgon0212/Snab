import Workspace from "./components/pannel/workspace";
import Window from "./components/pannel/window";
import Header from "./components/header";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  pointerWithin,
} from "@dnd-kit/core";
import { useSensors, useSensor, PointerSensor } from "@dnd-kit/core";
import Tab from "./components/ui/Tab";
import { useEffect, useState } from "react";
import useAllWindows from "./hooks/useAllWindows";
import { useWorkspaceStore } from "./store/workspace";
import { startIntro } from "./components/Intro";

export default function App() {
  const { allWindows, setAllWindows } = useAllWindows();
  const { updateWorkspace, activeWorkspace, loadWorkspaces } =
    useWorkspaceStore();
  const [draggingTab, setDraggingTab] = useState<chrome.tabs.Tab | null>(null);

  useEffect(() => {
    console.log(
      `                    
                      .##=                                            
                       *###                                           
                       *###.                                          
                      .####.                 =+=                      
                      =####              .+####=                      
                     +####.            =#####+.                       
                    *####=         .*#####*                           
                  .*####:        -######*.                            
                 =#####*      =######=                                
                *#*###############. .+*###-                           
               *###############: .*#######-                           
             .+#############*:.:######****                            
             .#############-.+#####=...::::                           
             #############.:####= .=*######*                          
             ############*.:##: -##########*.                         
             #############*- .:######*:. -#.                          
             ###############+: +** .. ####-                           
             ################**::=***#:+*.                            
            ##########################*=                              
          :##########################:                                
         +########################-..                                 
          :*##################*.                                      
            *#############.                                           
             .=##########-                                            
                :+######:                                              
      `
    );
    console.log(
      "%c███████╗███╗   ██╗ █████╗ ██████╗ \n" +
        "██╔════╝████╗  ██║██╔══██╗██╔══██╗\n" +
        "███████╗██╔██╗ ██║███████║██████╔╝\n" +
        "╚════██║██║╚██╗██║██╔══██║██╔══██╗\n" +
        "███████║██║ ╚████║██║  ██║███████║\n" +
        "╚══════╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝",
      "background: linear-gradient(90deg, #60A5FA, #A78BFA, #F472B6);" +
        "color: transparent;" +
        "-webkit-background-clip: text;" +
        "font-family: monospace;" +
        "font-weight: 700;" +
        "font-size: 14px;" +
        "line-height: 1.1;"
    );

    console.log(
      "%c✨ Snab을 이용해주셔서 감사합니다! 👀\n%c수정사항이나 버그 발생 시 메일로 알려주세요 :) 📧 \n\n%c>>>>>> kwgon0102@gmail.com <<<<<<",
      "color:#A78BFA; font-weight:bold; font-size:14px;",
      "color:#9CA3AF; font-size:12px; font-style:italic;",
      "color:#F472B6; font-size:15px; font-style:italic;"
    );
  }, []);

  useEffect(() => {
    loadWorkspaces();
  }, []);

  // 튜토리얼 완료 여부 확인 및 초기 튜토리얼 실행
  useEffect(() => {
    const checkAndShowTutorial = async () => {
      try {
        const result = await chrome.storage.local.get("tutorialCompleted");

        // 키가 없으면 초기값 false로 생성
        if (result.tutorialCompleted === undefined) {
          await chrome.storage.local.set({ tutorialCompleted: false });
        }

        const tutorialCompleted = result.tutorialCompleted || false;

        // 튜토리얼을 아직 보지 않았다면 실행
        if (!tutorialCompleted) {
          startIntro();
        }
      } catch (error) {
        console.error("튜토리얼 상태 확인 실패:", error);
        // 에러 발생 시에도 튜토리얼 실행
        startIntro();
      }
    };

    checkAndShowTutorial();
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (!active.data.current) return;

    const tabInfo = active.data.current.tabInfo as chrome.tabs.Tab;
    setDraggingTab(tabInfo);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !over.data.current) {
      setDraggingTab(null);
      return;
    }

    if (!active.data.current) {
      setDraggingTab(null);
      return;
    }

    const origin = active.data.current.origin;
    const draggedTab = active.data.current.tabInfo as chrome.tabs.Tab;

    // 같은 그룹 내에서 탭 정렬
    if (
      over.data.current.type === "tab" &&
      origin?.type === "group" &&
      activeWorkspace
    ) {
      handleGroupTabSort(active.id as string, over.id as string, origin.id);
      setDraggingTab(null);
      return;
    }

    // workspace의 group -> group으로 드래그 시 탭 이동
    if (over.data.current.type === "group" && origin?.type === "group") {
      handleGroupToGroupMove(
        draggedTab,
        origin.id,
        over.data.current.id,
        over.data.current.workspaceId || activeWorkspace?.id
      );
      setDraggingTab(null);
      return;
    }

    // window -> workspace의 group으로 드래그 시 탭 추가
    if (over.data.current.type === "group" && origin?.type === "window") {
      handleWindowToGroupMove(
        draggedTab,
        over.data.current.id,
        over.data.current.workspaceId || activeWorkspace?.id
      );
      setDraggingTab(null);
      return;
    }

    // 같은 윈도우 내에서 탭 정렬
    if (over.data.current.type === "tab" && origin?.type === "window") {
      handleWindowTabSort(
        active.id as string,
        over.id as string,
        parseInt(origin.id)
      );
      setDraggingTab(null);
      return;
    }

    // window -> window로 드래그 시 탭 이동
    if (over.data.current.type === "window" && origin?.type === "window") {
      handleWindowToWindowMove(
        draggedTab,
        parseInt(origin.id),
        over.data.current.id as number
      );
      setDraggingTab(null);
      return;
    }

    // workspace의 group -> window로 드래그 시 탭 추가
    if (over.data.current.type === "window" && origin?.type === "group") {
      handleGroupToWindowMove(
        draggedTab,
        origin.id,
        over.data.current.id as number
      );
      setDraggingTab(null);
      return;
    }

    setDraggingTab(null);
  };

  // 같은 그룹 내에서 탭 정렬
  const handleGroupTabSort = (
    activeTabId: string,
    overTabId: string,
    groupId: string
  ) => {
    if (!activeWorkspace || activeTabId === overTabId) return;

    const sourceGroup = activeWorkspace.groups.find((g) => g.id === groupId);
    if (!sourceGroup) return;

    // ID 파싱: group-${groupId}-tab-${tabId} 형식에서 tabId 추출
    const parseTabId = (id: string) => {
      const match = id.match(/-tab-(.+)$/);
      return match ? match[1] : null;
    };

    const activeTabIdParsed = parseTabId(activeTabId);
    const overTabIdParsed = parseTabId(overTabId);

    if (!activeTabIdParsed || !overTabIdParsed) return;

    const oldIndex = sourceGroup.tabs.findIndex((tab) => {
      const tabIdStr =
        typeof tab.id === "number" ? String(tab.id) : String(tab.id || "");
      return tabIdStr === activeTabIdParsed;
    });
    const newIndex = sourceGroup.tabs.findIndex((tab) => {
      const tabIdStr =
        typeof tab.id === "number" ? String(tab.id) : String(tab.id || "");
      return tabIdStr === overTabIdParsed;
    });

    if (oldIndex !== -1 && newIndex !== -1) {
      const newTabs = [...sourceGroup.tabs];
      const [removed] = newTabs.splice(oldIndex, 1);
      newTabs.splice(newIndex, 0, removed);

      const updatedGroups = activeWorkspace.groups.map((group) =>
        group.id === groupId ? { ...group, tabs: newTabs } : group
      );

      updateWorkspace(activeWorkspace.id, { groups: updatedGroups });
    }
  };

  // workspace의 group -> group으로 드래그 시 탭 이동
  const handleGroupToGroupMove = (
    draggedTab: chrome.tabs.Tab,
    sourceGroupId: string,
    targetGroupId: string,
    workspaceId?: string
  ) => {
    if (!workspaceId || !activeWorkspace || sourceGroupId === targetGroupId)
      return;

    const updatedGroups = activeWorkspace.groups.map((group) => {
      if (group.id === sourceGroupId) {
        return {
          ...group,
          tabs: group.tabs.filter((tab) => tab.id !== draggedTab.id),
        };
      }
      if (group.id === targetGroupId) {
        const tabExists = group.tabs.some((tab) => tab.url === draggedTab.url);
        if (!tabExists) {
          return {
            ...group,
            tabs: [...group.tabs, draggedTab],
          };
        }
      }
      return group;
    });

    updateWorkspace(workspaceId, { groups: updatedGroups });
  };

  // window -> workspace의 group으로 드래그 시 탭 추가
  const handleWindowToGroupMove = (
    draggedTab: chrome.tabs.Tab,
    groupId: string,
    workspaceId?: string
  ) => {
    if (!workspaceId || !activeWorkspace) return;

    const updatedGroups = activeWorkspace.groups.map((group) => {
      if (group.id === groupId) {
        const tabExists = group.tabs.some((tab) => tab.url === draggedTab.url);
        if (!tabExists) {
          return {
            ...group,
            tabs: [...group.tabs, draggedTab],
          };
        }
      }
      return group;
    });

    updateWorkspace(workspaceId, { groups: updatedGroups });
    chrome.tabs.remove(draggedTab.id!);
  };

  // 같은 윈도우 내에서 탭 정렬
  const handleWindowTabSort = (
    activeTabId: string,
    overTabId: string,
    windowId: number
  ) => {
    if (activeTabId === overTabId) return;

    // ID 파싱: window-${windowId}-tab-${tabId} 형식에서 tabId 추출
    const parseTabId = (id: string) => {
      const match = id.match(/-tab-(.+)$/);
      return match ? parseInt(match[1]) : null;
    };

    const activeTabIdNum = parseTabId(activeTabId);
    const overTabIdNum = parseTabId(overTabId);

    if (!activeTabIdNum || !overTabIdNum) return;

    const sourceWindow = allWindows.find((w) => w.id === windowId);
    if (!sourceWindow || !sourceWindow.tabs) return;

    const activeTab = sourceWindow.tabs.find(
      (tab) => tab.id === activeTabIdNum
    );
    const overTab = sourceWindow.tabs.find((tab) => tab.id === overTabIdNum);

    if (!activeTab || !overTab || activeTab.windowId !== overTab.windowId)
      return;

    const oldIndex = sourceWindow.tabs.findIndex(
      (tab) => tab.id === activeTabIdNum
    );
    const newIndex = sourceWindow.tabs.findIndex(
      (tab) => tab.id === overTabIdNum
    );

    if (oldIndex !== -1 && newIndex !== -1) {
      chrome.tabs.move(activeTabIdNum, { index: newIndex });

      setAllWindows((prevWindows) =>
        prevWindows.map((window) => {
          if (window.id === windowId && window.tabs) {
            const newTabs = [...window.tabs];
            const [removed] = newTabs.splice(oldIndex, 1);
            newTabs.splice(newIndex, 0, removed);
            return { ...window, tabs: newTabs };
          }
          return window;
        })
      );
    }
  };

  // window -> window로 드래그 시 탭 이동
  const handleWindowToWindowMove = (
    draggedTab: chrome.tabs.Tab,
    sourceWindowId: number,
    targetWindowId: number
  ) => {
    if (!draggedTab.id || sourceWindowId === targetWindowId) return;

    chrome.tabs.move(draggedTab.id, {
      windowId: targetWindowId,
      index: -1,
    });

    setAllWindows((prevWindows) =>
      prevWindows.map((window) => {
        if (window.id === sourceWindowId && window.tabs) {
          return {
            ...window,
            tabs: window.tabs.filter((tab) => tab.id !== draggedTab.id),
          };
        }
        if (window.id === targetWindowId && window.tabs) {
          return {
            ...window,
            tabs: [...window.tabs, draggedTab],
          };
        }
        return window;
      })
    );
  };

  // workspace의 group -> window로 드래그 시 탭 추가
  const handleGroupToWindowMove = (
    draggedTab: chrome.tabs.Tab,
    sourceGroupId: string,
    targetWindowId: number
  ) => {
    if (!activeWorkspace || !draggedTab.url) return;

    chrome.tabs.create({
      windowId: targetWindowId,
      url: draggedTab.url,
      active: false,
    });

    const updatedGroups = activeWorkspace.groups.map((group) => {
      if (group.id === sourceGroupId) {
        return {
          ...group,
          tabs: group.tabs.filter((tab) => tab.id !== draggedTab.id),
        };
      }
      return group;
    });

    updateWorkspace(activeWorkspace.id, { groups: updatedGroups });
  };

  return (
    <div className="w-screen h-screen flex flex-col">
      <Header />
      <DndContext
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        // onDragOver={handleDragOver}
        sensors={sensors}
        collisionDetection={pointerWithin}
      >
        <main className="w-full flex h-[calc(100vh-4rem)] overflow-hidden">
          <Workspace />
          <Window allWindows={allWindows} />

          <DragOverlay zIndex={20}>
            {draggingTab && (
              <Tab
                id={draggingTab.id!}
                origin={{
                  type: "window",
                  id: draggingTab.windowId!.toString(),
                }}
                onClick={() => {}}
                tabInfo={draggingTab}
              />
            )}
          </DragOverlay>
        </main>
      </DndContext>
    </div>
  );
}
