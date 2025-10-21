import { X } from "lucide-react";
import { closeWindow } from "../../../utils/windows";

const CloseWindowButton = ({ windowId }: { windowId: number }) => {
  const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    closeWindow(windowId);
  };

  return (
    <button
      onClick={handleClose}
      className="size-3.5 rounded-full bg-red-400 hover:bg-red-500 hover:scale-120 transition-all duration-300 flex items-center justify-center group"
    >
      <X className="size-2 text-red-800 opacity-0 group-hover:opacity-100 transition-all duration-300" />
    </button>
  );
};

export default CloseWindowButton;
