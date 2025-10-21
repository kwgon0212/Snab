import { Minus } from "lucide-react";
import { minimizeWindow } from "../../../utils/windows";

const MinimizedWindowButton = ({ windowId }: { windowId: number }) => {
  const handleMinimize = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    minimizeWindow(windowId);
  };

  return (
    <button
      onClick={handleMinimize}
      className="size-3.5 rounded-full bg-yellow-400 hover:bg-yellow-500 hover:scale-120 transition-all duration-300 flex items-center justify-center group"
    >
      <Minus className="size-2 text-yellow-800 opacity-0 group-hover:opacity-100 transition-all duration-300" />
    </button>
  );
};

export default MinimizedWindowButton;
