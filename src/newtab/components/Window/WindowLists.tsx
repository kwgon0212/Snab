import { ChevronDown } from "lucide-react";
import Links from "./Links";
import { useState } from "react";
import { cn } from "@/utils/cn";
import AddTab from "./AddTab";
import CloseWindow from "./CloseWindowButton";
import MinimizedWindow from "./MinimizedWindowButton";
import FullscreenWindow from "./FullscreenWindowButton";

const WindowLists = ({ windows }: { windows: chrome.windows.Window[] }) => {
  const [openStates, setOpenStates] = useState<Record<number, boolean>>({});

  const toggleWindow = (windowId: number) => {
    setOpenStates((prev) => ({
      ...prev,
      [windowId]: !prev[windowId],
    }));
  };

  return (
    <div className="w-full min-w-0 flex flex-col gap-2">
      {windows.map((window, idx) => {
        const isOpen = openStates[window.id!] || false;

        return (
          <div
            key={`window-${window.id}`}
            className={cn(
              "w-full min-w-0 flex flex-col border px-5 py-4 rounded-lg",
              window.focused
                ? "border-blue-300 border-2"
                : "border-slate-300 border-1"
            )}
          >
            <div
              className="w-full min-w-0 flex justify-between items-center cursor-pointer"
              onClick={() => toggleWindow(window.id!)}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <CloseWindow windowId={window.id!} />
                  <MinimizedWindow windowId={window.id!} />
                  <FullscreenWindow
                    windowId={window.id!}
                    windowState={window.state!}
                  />
                </div>
                <h3 className="text-base truncate">{`윈도우 #${idx + 1}`}</h3>
              </div>

              <ChevronDown
                className={cn(
                  "transition-transform duration-300 cursor-pointer text-slate-400",
                  isOpen ? "rotate-180" : ""
                )}
              />
            </div>

            <div
              className={cn(
                "grid transition-all duration-300 ease-in-out",
                isOpen
                  ? "grid-rows-[1fr] opacity-100 mt-4"
                  : "grid-rows-[0fr] opacity-0 mt-0"
              )}
            >
              <div className="overflow-hidden flex flex-col gap-3">
                <span className="text-slate-500">
                  총 {window.tabs ? window.tabs.length : "0"}개의 탭
                </span>
                <Links tabs={window.tabs ?? []} />
                <AddTab windowId={window.id} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WindowLists;
