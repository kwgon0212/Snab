import logo from "@/assets/logo.png";
import { version } from "@/../package.json";
import { useEffect, useState } from "react";
import Divider from "../ui/Divider";
import Options from "./Options";
import SnapshotButton from "./SnapshotButton";
import Switch from "../ui/Switch";

const Header = () => {
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
    <header className="w-full h-16 shadow-sm bg-white flex items-center justify-between px-5 border-b border-gray-200">
      <div className="flex items-center gap-2">
        <img src={logo} alt="Snab" className="size-8 rounded" />
        <div className="flex items-baseline gap-2">
          <h1 className="text-xl font-bold text-gray-800">Snab</h1>
          <h2 className="text-sm text-gray-500">Tab Management</h2>
          <h4 className="text-xs text-gray-400">v{version}</h4>
        </div>
      </div>

      <div className="flex gap-3 items-center">
        <div className="flex items-center gap-2">
          <SnapshotButton
            closeWindowsAfterSnapshot={closeWindowsAfterSnapshot}
          />

          <div className="intro-snapshot-option flex items-center gap-2">
            <span className="text-xs text-gray-600 whitespace-nowrap">
              스냅샷 후 모든 윈도우
            </span>
            <div className="flex items-center gap-1.5">
              <Switch
                checked={closeWindowsAfterSnapshot}
                onChange={handleToggle}
              />
              <span className="text-xs text-gray-500">
                {closeWindowsAfterSnapshot ? "유지" : "닫기"}
              </span>
            </div>
          </div>
        </div>
        <Divider direction="vertical" />
        <Options />
      </div>
    </header>
  );
};

export default Header;
