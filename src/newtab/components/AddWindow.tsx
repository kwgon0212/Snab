import { Plus } from "lucide-react";
import { createWindow } from "../../../utils/windows";

const AddWindow = () => {
  return (
    <button
      onClick={createWindow}
      className="w-full h-10 bg-blue-500 text-white rounded-lg flex items-center gap-2 justify-center px-5 py-4"
    >
      <Plus className="size-5" />
      <span className="text-sm">새 윈도우 열기</span>
    </button>
  );
};

export default AddWindow;
