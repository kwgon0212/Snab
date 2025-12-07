import logo from "@/assets/logo.png";
import { version } from "@/../package.json";
import { useEffect, useState } from "react";
import Options from "./Options";
import SnapshotButton from "./SnapshotButton";
import Switch from "../ui/Switch";
import LanguageSelector from "./LanguageSelector";
import { useTranslation } from "react-i18next";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  const { t } = useTranslation();
  const [closeWindowsAfterSnapshot, setCloseWindowsAfterSnapshot] =
    useState(false);

  // storage에서 초기값 로드 및 상태 변경 시 저장
  useEffect(() => {
    // 초기값 로드
    chrome.storage.local.get("snapshotCloseWindows", (result) => {
      if (result.snapshotCloseWindows !== undefined) {
        setCloseWindowsAfterSnapshot(result.snapshotCloseWindows);
      }
    });
  }, []);

  // 상태 변경 시 storage에 저장
  const handleToggle = () => {
    const newValue = !closeWindowsAfterSnapshot;
    setCloseWindowsAfterSnapshot(newValue);
    chrome.storage.local.set({ snapshotCloseWindows: newValue });
  };

  return (
    <header className="w-full h-16 shadow-sm bg-white dark:bg-slate-950 flex items-center justify-between px-5 border-b border-gray-200 dark:border-slate-800 transition-colors duration-300">
      <div className="flex items-center gap-2">
        <img src={logo} alt="Snab" className="size-8 rounded" />
        <div className="flex items-baseline gap-2">
          <h1 className="text-xl font-bold text-gray-800 dark:text-slate-100">
            {t("header.title")}
          </h1>
          <h2 className="text-sm text-gray-500 dark:text-slate-300">
            {t("header.subtitle")}
          </h2>
          <h4 className="text-xs text-gray-400 dark:text-slate-400">
            v{version}
          </h4>
        </div>
      </div>

      <div className="flex gap-3 items-center">
        <div className="flex items-center gap-2">
          <SnapshotButton
            closeWindowsAfterSnapshot={closeWindowsAfterSnapshot}
          />

          <div className="intro-snapshot-option flex items-center gap-2 text-gray-500 dark:text-slate-400">
            <span className="text-xs whitespace-nowrap">
              {t("header.snapshot.label")}
            </span>
            <div className="flex items-center gap-1.5">
              <Switch
                checked={closeWindowsAfterSnapshot}
                onChange={handleToggle}
              />
              <span className="text-xs">
                {closeWindowsAfterSnapshot
                  ? t("header.snapshot.keep")
                  : t("header.snapshot.close")}
              </span>
            </div>
          </div>
        </div>

        <LanguageSelector />

        <ThemeToggle />

        <Options />
      </div>
    </header>
  );
};

export default Header;
