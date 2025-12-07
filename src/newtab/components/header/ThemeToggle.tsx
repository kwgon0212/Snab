import { useThemeStore } from "@/newtab/store/theme";
import { Moon, Sun, Monitor, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import Tooltip from "@/newtab/components/ui/Tooltip";
import { cn } from "@/utils/cn";
import { useRef, useState } from "react";
import useOutsideClick from "@/newtab/hooks/useOutsideClick";

const ThemeToggle = () => {
  const { theme, setTheme } = useThemeStore();
  const { t } = useTranslation();
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useOutsideClick(menuRef, () => setIsOpen(false));

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  const getIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="size-4" />;
      case "dark":
        return <Moon className="size-4" />;
      case "system":
        return <Monitor className="size-4" />;
    }
  };

  const getLabel = () => {
    // We might need to add these keys to translation files
    switch (theme) {
      case "light":
        return "Light";
      case "dark":
        return "Dark";
      case "system":
        return "System";
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <Tooltip title={getLabel()} position="bottom">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center justify-center p-2 rounded-lg transition-all duration-200 border border-transparent",
            "hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95",
            "text-slate-600 dark:text-slate-300 hover:border-slate-200 dark:hover:border-slate-600"
          )}
        >
          {getIcon()}
        </button>
      </Tooltip>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-50 overflow-hidden">
          <button
            onClick={() => handleThemeChange("light")}
            className={cn(
              "w-full text-left px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200 flex items-center justify-between",
              theme === "light"
                ? "text-blue-600 dark:text-blue-400 font-semibold bg-blue-50/50 dark:bg-blue-500/10"
                : "text-slate-700 dark:text-slate-300"
            )}
          >
            <div className="flex items-center gap-3">
              <Sun className="size-4" />
              <span>Light</span>
            </div>
            {theme === "light" && <Check className="size-4" />}
          </button>

          <button
            onClick={() => handleThemeChange("dark")}
            className={cn(
              "w-full text-left px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200 flex items-center justify-between",
              theme === "dark"
                ? "text-blue-600 dark:text-blue-400 font-semibold bg-blue-50/50 dark:bg-blue-500/10"
                : "text-slate-700 dark:text-slate-300"
            )}
          >
            <div className="flex items-center gap-3">
              <Moon className="size-4" />
              <span>Dark</span>
            </div>
            {theme === "dark" && <Check className="size-4" />}
          </button>

          <button
            onClick={() => handleThemeChange("system")}
            className={cn(
              "w-full text-left px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200 flex items-center justify-between",
              theme === "system"
                ? "text-blue-600 dark:text-blue-400 font-semibold bg-blue-50/50 dark:bg-blue-500/10"
                : "text-slate-700 dark:text-slate-300"
            )}
          >
            <div className="flex items-center gap-3">
              <Monitor className="size-4" />
              <span>System</span>
            </div>
            {theme === "system" && <Check className="size-4" />}
          </button>
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;
