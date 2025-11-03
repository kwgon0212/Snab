import { cn } from "@/utils/cn";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

interface ToggleSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const ToggleSidebar = ({ isCollapsed, onToggle }: ToggleSidebarProps) => {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "fixed bottom-5 left-5 box-content bg-white border border-slate-200 hover:border-blue-400 text-slate-400 hover:text-blue-500 rounded-full flex items-center justify-center shadow-sm hover:shadow-md backdrop-blur-sm z-30 transition-all duration-300",
        "transform hover:scale-105 active:scale-95"
      )}
      title={isCollapsed ? "사이드바 열기" : "사이드바 닫기"}
    >
      <div className="relative size-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <PanelLeftClose
            className={cn(
              "size-6 transition-opacity duration-300 ease-in-out",
              isCollapsed && "opacity-0"
            )}
            strokeWidth={1.2}
          />
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <PanelLeftOpen
            className={cn(
              "size-6 transition-opacity duration-300 ease-in-out",
              !isCollapsed && "opacity-0"
            )}
            strokeWidth={1.2}
          />
        </div>
      </div>
    </button>
  );
};

export default ToggleSidebar;
