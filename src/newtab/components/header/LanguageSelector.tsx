import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import { useState, useRef } from "react";
import { cn } from "@/utils/cn";
import useOutsideClick from "@/newtab/hooks/useOutsideClick";

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  useOutsideClick(dropdownRef, () => setIsOpen(false));

  const getCurrentLabel = () => {
    return i18n.language?.startsWith("ko") ? "KO" : "EN";
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="group flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 text-slate-600 dark:text-slate-300 transition-all duration-200 border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
      >
        <Globe className="size-4" />
        <span className="text-xs font-medium">{getCurrentLabel()}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-50 overflow-hidden">
          <button
            onClick={() => changeLanguage("ko")}
            className={cn(
              "w-full text-left px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200 flex items-center justify-between",
              i18n.language?.startsWith("ko")
                ? "text-blue-600 dark:text-blue-400 font-semibold bg-blue-50/50 dark:bg-blue-500/10"
                : "text-slate-700 dark:text-slate-300"
            )}
          >
            <span>한국어</span>
            {i18n.language?.startsWith("ko") && (
              <span className="text-[10px] bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded font-bold">
                KO
              </span>
            )}
          </button>
          <button
            onClick={() => changeLanguage("en")}
            className={cn(
              "w-full text-left px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200 flex items-center justify-between",
              i18n.language?.startsWith("en")
                ? "text-blue-600 dark:text-blue-400 font-semibold bg-blue-50/50 dark:bg-blue-500/10"
                : "text-slate-700 dark:text-slate-300"
            )}
          >
            <span>English</span>
            {i18n.language?.startsWith("en") && (
              <span className="text-[10px] bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded font-bold">
                EN
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
