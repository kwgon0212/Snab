// import TempStorage from "./TempStorage";
import { useState, useEffect, useRef } from "react";
import logo from "@/assets/logo.png";
import { Camera, Download, Upload, MoreHorizontal } from "lucide-react";
import { cn } from "@/utils/cn";
import {
  downloadDataAsJSON,
  selectAndImportJSON,
  importDataFromJSON,
} from "@/utils/dataExport";
import { version } from "../../../package.json";

interface HeaderProps {
  onSnapshot: () => void;
  closeWindowsAfterSnapshot: boolean;
  onToggleCloseWindows: () => void;
}

const Header = ({
  onSnapshot,
  closeWindowsAfterSnapshot,
  onToggleCloseWindows,
}: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 메뉴 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  // 데이터 내보내기
  const handleExportData = async () => {
    try {
      await downloadDataAsJSON();
      alert("데이터가 성공적으로 내보내졌습니다.");
      setIsMenuOpen(false);
    } catch (error) {
      alert("데이터 내보내기에 실패했습니다.");
    }
  };

  // 데이터 가져오기
  const handleImportData = async () => {
    try {
      const file = await selectAndImportJSON();
      if (file) {
        await importDataFromJSON(file);
        alert("데이터가 성공적으로 추가되었습니다. 페이지를 새로고침합니다.");
        window.location.reload();
      }
      setIsMenuOpen(false);
    } catch (error) {
      alert("데이터 가져오기에 실패했습니다.");
    }
  };
  return (
    <header className="w-full h-16 shrink-0 flex items-center justify-between px-5 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-2">
        {/* 로고 */}
        <img src={logo} alt="Snab" className="size-8 rounded" />
        <div className="flex items-baseline gap-2">
          <h1 className="text-xl font-bold text-gray-800">Snab</h1>
          <h2 className="text-sm text-gray-500">Tab Management</h2>
          <h4 className="text-xs text-gray-400">v{version}</h4>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* 스냅샷 버튼 */}
        <button
          onClick={onSnapshot}
          className="group flex items-center gap-0 px-3 py-2 bg-blue-500 hover:bg-blue-600 active:scale-95 text-white rounded-full transition-all duration-200 font-medium shadow-sm hover:shadow-md overflow-hidden"
        >
          <Camera className="size-4" />
          <span className="opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap group-hover:ml-2 max-w-0 group-hover:max-w-20 overflow-hidden">
            스냅샷
          </span>
        </button>

        {/* 토글 스위치 */}
        <div className="flex items-center gap-2 px-2">
          <button
            onClick={onToggleCloseWindows}
            className={cn(
              "relative w-6 h-3 rounded-full transition-colors duration-300 outline-none flex-shrink-0",
              !closeWindowsAfterSnapshot ? "bg-blue-500" : "bg-slate-300"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 left-0.5 bg-white w-2 h-2 rounded-full transition-transform duration-300 shadow-sm",
                !closeWindowsAfterSnapshot && "translate-x-3"
              )}
            />
          </button>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500">
              모든 윈도우 저장 및{" "}
              <b className="text-blue-500 font-bold">
                {closeWindowsAfterSnapshot ? "유지" : "닫기"}
              </b>
            </span>
          </div>
        </div>

        {/* 옵션 구분선 */}
        <div className="h-8 w-px bg-slate-300 mx-1" />

        {/* 메뉴 버튼 */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="group flex items-center gap-0 px-3 py-2 hover:bg-slate-100 active:scale-95 text-gray-800 rounded-md transition-all duration-200 font-medium overflow-hidden"
            title="메뉴"
          >
            <MoreHorizontal className="size-4" />
          </button>

          {/* 드롭다운 메뉴 */}
          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-slate-200 py-1 z-50">
              <button
                onClick={handleExportData}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-200"
              >
                <Download className="size-4" />
                데이터 내보내기
              </button>
              <button
                onClick={handleImportData}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-200"
              >
                <Upload className="size-4" />
                데이터 가져오기
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
