import WorkspaceLayout from "./features/workspace/components/WorkspaceLayout";
import WindowSectionContainer from "./features/window/containers/WindowSectionContainer";
import Header from "./components/header";
import { DndContext, DragOverlay, pointerWithin } from "@dnd-kit/core";
import { useSensors, useSensor, PointerSensor } from "@dnd-kit/core";
import Tab from "./components/ui/Tab";
import { useEffect } from "react";
import useAllWindows from "./hooks/useAllWindows";
import { useWorkspaceStore } from "./store/workspace";
import { useDragHandlers } from "./hooks/useDragHandlers";
import { startIntro } from "./components/Intro";
import { useThemeStore } from "./store/theme";

export default function App() {
  const { allWindows, setAllWindows } = useAllWindows();
  const { loadWorkspaces } = useWorkspaceStore();
  const { getEffectiveTheme, theme } = useThemeStore();

  useEffect(() => {
    const effectiveTheme = getEffectiveTheme();
    if (effectiveTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

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
        // startIntro(); // Removed as per instruction
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

  const { draggingTab, handleDragStart, handleDragEnd } = useDragHandlers(
    allWindows,
    setAllWindows
  );

  return (
    <div className="w-screen h-screen flex flex-col dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Header />
      <DndContext
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        // onDragOver={handleDragOver}
        sensors={sensors}
        collisionDetection={pointerWithin}
      >
        <main className="w-full flex h-[calc(100vh-4rem)] overflow-hidden">
          <WorkspaceLayout />
          <WindowSectionContainer allWindows={allWindows} />

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
