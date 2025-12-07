import { Plus, Trash2, X } from "lucide-react";
import { Activity } from "react";
import { cn } from "@/utils/cn";
import { Workspace } from "@/newtab/types/workspace";
import logo from "@/assets/logo.png";
import qrCode from "@/assets/kakaopay.jpg";
import { useTranslation, Trans } from "react-i18next";

interface SidebarProps {
  width: number;
  workspaces: Workspace[];
  activeWorkspaceId?: string;
  showDonationModal: boolean;
  isClosing: boolean;
  onAddWorkspace: () => void;
  onDeleteWorkspace: (id: string, e: React.MouseEvent) => void;
  onSelectWorkspace: (workspace: Workspace) => void;
  onCloseDonation: () => void;
  onOpenDonation: () => void;
}

const Sidebar = ({
  width,
  workspaces,
  activeWorkspaceId,
  showDonationModal,
  isClosing,
  onAddWorkspace,
  onDeleteWorkspace,
  onSelectWorkspace,
  onCloseDonation,
  onOpenDonation,
}: SidebarProps) => {
  const { t } = useTranslation();
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
              onClick={onCloseDonation}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors duration-200"
              title={t("sidebar.donationModal.close")}
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
            <p className="text-sm leading-relaxed opacity-90">
              <Trans i18nKey="sidebar.donationModal.message" />
            </p>

            <img
              src={qrCode}
              alt="후원 QR 코드"
              className="w-full aspect-square object-contain rounded-md"
            />
            <p className="text-xs opacity-80 font-medium">
              {t("sidebar.donationModal.qrDesc")}
            </p>
          </div>
        </div>
      </Activity>

      <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
        Workspace
      </h2>
      <button
        onClick={onAddWorkspace}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md transition-colors duration-200"
      >
        <Plus className="size-4" />
        {t("sidebar.addWorkspace")}
      </button>

      {/* <Divider direction="horizontal" /> */}

      <div
        className="flex-1 overflow-y-auto flex flex-col gap-2"
        role="list"
        aria-label="워크스페이스 목록"
      >
        {workspaces.map((workspace) => (
          <button
            key={workspace.id}
            role="listitem"
            className={cn(
              "w-full flex justify-between items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md transition-colors duration-200 group cursor-pointer text-left",
              activeWorkspaceId === workspace.id &&
                "bg-slate-100 dark:bg-slate-800"
            )}
            onClick={() => onSelectWorkspace(workspace)}
            aria-current={
              activeWorkspaceId === workspace.id ? "page" : undefined
            }
          >
            <h3
              className={cn(
                "text-sm font-medium text-slate-800 dark:text-slate-200 truncate",
                activeWorkspaceId === workspace.id
                  ? "text-blue-500 dark:text-blue-400 font-bold"
                  : "text-slate-500 dark:text-slate-400 font-medium"
              )}
            >
              {workspace.name}
            </h3>
            <div
              role="button"
              tabIndex={0}
              onClick={(e) => onDeleteWorkspace(workspace.id, e)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation();
                  onDeleteWorkspace(workspace.id, e as any);
                }
              }}
              className="p-1 text-slate-400 hover:text-red-500 hover:scale-110 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
              title={t("content.deleteWorkspace")}
              aria-label={`${workspace.name} ${t("content.deleteWorkspace")}`}
            >
              <Trash2 className="size-3" />
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={onOpenDonation}
          className="intro-donation-button w-fit text-xs text-slate-400 hover:text-slate-600 transition-colors duration-200"
        >
          ☕️ {t("sidebar.donation")}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
