// import TempStorage from "./TempStorage";
import logo from "@/assets/logo.png";
import { Camera } from "lucide-react";
import { cn } from "@/utils/cn";

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
  return (
    <header className="w-full h-16 shrink-0 flex items-center justify-between px-5 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-2">
        {/* 로고 */}
        <img src={logo} alt="Snab" className="size-8 rounded" />
        <h1 className="text-xl font-bold text-gray-800">Snab</h1>
        <h2 className="text-sm text-gray-500">Tab Management</h2>
      </div>

      <div className="flex items-center gap-2">
        {/* 스냅샷 버튼 */}
        <button
          onClick={onSnapshot}
          className="group flex items-center gap-0 px-3 py-2 bg-blue-500 hover:bg-blue-600 active:scale-95 text-white rounded-md transition-all duration-200 font-medium shadow-sm hover:shadow-md overflow-hidden"
        >
          <Camera className="size-4" />
          <span className="opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap group-hover:ml-2 max-w-0 group-hover:max-w-20 overflow-hidden">
            스냅샷
          </span>
        </button>

        {/* 옵션 구분선 */}
        <div className="h-8 w-px bg-slate-300 mx-1" />

        {/* 토글 스위치 */}
        <div className="flex items-center gap-2 px-2">
          <button
            onClick={onToggleCloseWindows}
            className={cn(
              "relative w-10 h-5 rounded-full transition-colors duration-300 outline-none flex-shrink-0",
              !closeWindowsAfterSnapshot ? "bg-blue-500" : "bg-slate-300"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform duration-300 shadow-sm",
                !closeWindowsAfterSnapshot && "translate-x-5"
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
      </div>
    </header>
  );
};

export default Header;
