import { Plus, Trash2, X } from "lucide-react";
import Divider from "../../ui/Divider";
import { useState, Activity } from "react";

import { cn } from "@/utils/cn";
import { useWorkspaceStore } from "@/newtab/store/workspace";
import { Workspace } from "@/newtab/types/workspace";
import logo from "@/assets/logo.png";
import qrCode from "@/assets/kakaopay.jpg";

interface SidebarProps {
  width: number;
}

const Sidebar = ({ width }: SidebarProps) => {
  const {
    workspaces,
    activeWorkspace,
    setActiveWorkspace,
    addWorkspace,
    deleteWorkspace,
  } = useWorkspaceStore();

  const [showDonationModal, setShowDonationModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleAddWorkspace = () => {
    const workspace: Workspace = {
      id: crypto.randomUUID(),
      name: "새 워크스페이스",
      groups: [],
      createdAt: new Date().toISOString(),
      groupViewMode: 1,
      tabViewMode: 1,
    };
    addWorkspace(workspace);
  };

  return (
    <aside
      className="size-full p-4 flex flex-col gap-2 relative"
      style={{ width: `${width}px` }}
    >
      <Activity mode={showDonationModal ? "visible" : "hidden"}>
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white flex flex-col p-4 z-50 overflow-hidden",
            showDonationModal && !isClosing && "animate-slide-in-from-left",
            isClosing && "animate-slide-out-to-left"
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <img src={logo} alt="Snab Logo" className="w-8 h-8 rounded" />
              <h1 className="text-xl font-semibold text-white drop-shadow-lg">
                Snab
              </h1>
            </div>
            <button
              onClick={() => {
                setIsClosing(true);
                setTimeout(() => {
                  setShowDonationModal(false);
                  setIsClosing(false);
                }, 300);
              }}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors duration-200"
              title="닫기"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
            <p className="text-sm leading-relaxed opacity-90">
              Snab이 도움이 되셨다면
              <br />
              커피 한 잔 어떠신지요 ㅎㅎ..
            </p>

            <img
              src={qrCode}
              alt="후원 QR 코드"
              className="w-full aspect-square object-contain rounded-md"
            />
            <p className="text-xs opacity-80 font-medium">
              QR 코드를 스캔하여 후원하기
            </p>
          </div>
        </div>
      </Activity>

      <h2 className="text-lg font-semibold text-slate-800">Workspace</h2>
      <button
        onClick={handleAddWorkspace}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-200 rounded-md transition-colors duration-200"
      >
        <Plus className="size-4" />새 워크스페이스
      </button>

      <Divider direction="horizontal" />

      <div className="flex-1 overflow-y-auto flex flex-col gap-2">
        {workspaces.map((workspace) => (
          <div
            key={workspace.id}
            className={cn(
              "w-full flex justify-between items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-200 rounded-md transition-colors duration-200 group cursor-pointer"
            )}
            onClick={() => setActiveWorkspace(workspace)}
          >
            <h3
              className={cn(
                "text-sm font-medium text-slate-800 truncate",
                activeWorkspace?.id === workspace.id
                  ? "text-blue-500 font-bold"
                  : "text-slate-500 font-medium"
              )}
            >
              {workspace.name}
            </h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteWorkspace(workspace.id);
              }}
              className="p-1 text-slate-400 hover:text-red-500 hover:scale-110 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
              title="워크스페이스 삭제"
            >
              <Trash2 className="size-3" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setShowDonationModal(true)}
          className="intro-donation-button w-fit text-xs text-slate-400 hover:text-slate-600 transition-colors duration-200"
        >
          ☕️ 후원하기
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
