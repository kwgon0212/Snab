import { ChevronLeft, ChevronRight } from "lucide-react";
import Tooltip from "@/newtab/components/ui/Tooltip";
import { cn } from "@/utils/cn";
import { useTranslation } from "react-i18next";

interface ToggleSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  width: number;
}

const ToggleSidebar = ({
  isCollapsed,
  onToggle,
  width,
}: ToggleSidebarProps) => {
  const { t } = useTranslation();
  return (
    <div
      className="absolute top-1/2 z-50 transform -translate-y-1/2 transition-all duration-75 ease-out"
      style={{ left: isCollapsed ? 0 : width }}
    >
      <Tooltip
        title={
          isCollapsed ? t("sidebar.toggle.open") : t("sidebar.toggle.close")
        }
        position="right"
      >
        <button
          onClick={onToggle}
          className={cn(
            "bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-md flex items-center justify-center w-6 h-12 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all",
            "text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400",
            isCollapsed ? "rounded-r-xl" : "rounded-full -ml-3" // Center on line when open
          )}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </Tooltip>
    </div>
  );
};

export default ToggleSidebar;
