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
          className="group relative flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 active:scale-[0.98] text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg font-medium overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          <Camera className="size-5 relative z-10" />
          <span className="relative z-10">스냅샷</span>
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
            <span className="text-xs text-slate-500">윈도우</span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500">
              {closeWindowsAfterSnapshot ? "유지" : "닫기"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
