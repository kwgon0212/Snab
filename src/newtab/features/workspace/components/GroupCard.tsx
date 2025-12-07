import {
  CornerRightDown,
  Edit2,
  ExternalLink,
  File,
  Folder,
  Trash2,
} from "lucide-react";
import Tab from "@/newtab/components/ui/Tab";
import { useDroppable, useDndContext } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import type { WorkspaceGroup } from "@/newtab/types/workspace";
import EditBlurInput from "@/newtab/components/ui/EditBlurInput";
import { useState } from "react";
import { cn } from "@/utils/cn";
import Tooltip from "@/newtab/components/ui/Tooltip";
import { useTranslation } from "react-i18next";

interface GroupCardProps {
  group: WorkspaceGroup;
  workspaceId: string;
  tabViewMode: 1 | 2 | 3;
  onRename: (group: WorkspaceGroup, name: string) => void;
  onDelete: (group: WorkspaceGroup) => void;
  onOpenWindow: (group: WorkspaceGroup) => void;
}

const GroupCard = ({
  group,
  workspaceId,
  tabViewMode,
  onRename,
  onDelete,
  onOpenWindow,
}: GroupCardProps) => {
  const { t } = useTranslation();
  const { setNodeRef, isOver } = useDroppable({
    id: `group-${group.id}`,
    data: {
      type: "group",
      id: group.id,
      workspaceId: workspaceId,
      name: group.name,
      tabs: group.tabs,
    },
  });

  const { active } = useDndContext();
  const activeOrigin = active?.data.current?.origin;

  const shouldShowOverlay =
    isOver &&
    (!activeOrigin ||
      activeOrigin.type !== "group" ||
      activeOrigin.id !== group.id.toString());

  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState(group.name);

  // Group header hover state to show actions
  const [isHovered, setIsHovered] = useState(false);

  const clickEditGroupName = () => {
    setEditingName(group.name);
    setIsEditing(true);
  };

  const handleBlur = () => {
    onRename(group, editingName);
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "w-full flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow h-fit break-inside-avoid overflow-hidden relative transition-all duration-300 hover:shadow-lg hover:border-blue-400/50 dark:hover:border-blue-500/50",
        shouldShowOverlay &&
          "border-blue-500 border-dashed ring-4 ring-blue-500/10"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Drag Overlay */}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center text-center bg-blue-50/95 z-20 backdrop-blur-sm transition-all duration-300",
          shouldShowOverlay
            ? "opacity-100 pointer-events-auto scale-100"
            : "opacity-0 pointer-events-none scale-95"
        )}
      >
        <p className="text-sm font-semibold text-blue-600 flex flex-col items-center gap-2 animate-bounce">
          <CornerRightDown className="size-6" />
          <span>{t("groupCard.dropPlaceholder")}</span>
        </p>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-3 py-2 bg-white dark:bg-slate-900 min-w-0 border-b border-transparent hover:border-slate-50 dark:hover:border-slate-800 transition-colors">
        <div className="text-blue-600 dark:text-blue-400 rounded-xl flex-shrink-0 ml-2">
          <Folder className="size-5" strokeWidth={2} />
        </div>

        <EditBlurInput
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          editingName={editingName}
          setEditingName={setEditingName}
          value={group.name}
          onBlur={handleBlur}
          className="flex-1 min-w-0 w-full text-[15px] font-semibold text-slate-700 dark:text-slate-200 truncate focus:ring-2 focus:ring-blue-500/20 rounded-md py-1 px-1 transition-all bg-transparent"
          aria-label={`${group.name} ${t("groupCard.editName")}`}
        />

        <div
          className={cn(
            "hidden lg:flex items-center gap-1 flex-shrink-0 transition-opacity duration-200",
            isHovered || isEditing ? "opacity-100" : "opacity-0"
          )}
        >
          <Tooltip title={t("groupCard.editName")} position="bottom">
            <button
              onClick={clickEditGroupName}
              title={t("groupCard.editName")}
              className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-all duration-200"
            >
              <Edit2 className="size-3.5" />
            </button>
          </Tooltip>
          <Tooltip title={t("groupCard.openWindow")} position="bottom">
            <button
              onClick={() => onOpenWindow(group)}
              title={t("groupCard.openWindow")}
              className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-all duration-200"
            >
              <ExternalLink className="size-3.5" />
            </button>
          </Tooltip>
          <Tooltip title={t("groupCard.deleteGroup")} position="bottom">
            <button
              onClick={() => onDelete(group)}
              title={t("groupCard.deleteGroup")}
              className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all duration-200"
            >
              <Trash2 className="size-3.5" />
            </button>
          </Tooltip>
        </div>
        {/* Mobile menu could go here if needed, keeping it simple for now */}
      </div>

      {/* Content */}
      <div
        className={cn(
          "bg-slate-50/50 dark:bg-slate-950/50 px-3 pb-4 grid gap-2.5",
          tabViewMode === 1 && "grid-cols-1",
          tabViewMode === 2 && "grid-cols-2",
          tabViewMode === 3 && "grid-cols-3"
        )}
      >
        <SortableContext
          items={group.tabs.map((tab, index) => {
            const tabId = typeof tab.id === "number" ? tab.id : tab.id || index;
            return `group-${group.id}-tab-${tabId}`;
          })}
          strategy={rectSortingStrategy}
        >
          {!group.tabs.length && (
            <div
              className={cn(
                "flex flex-col justify-center items-center gap-2 py-6 text-slate-300 border-2 border-dashed border-slate-200 rounded-xl",
                tabViewMode === 1 && "col-span-1",
                tabViewMode === 2 && "col-span-2",
                tabViewMode === 3 && "col-span-3"
              )}
            >
              <File className="size-6 opacity-40" />
              <p className="text-xs font-medium">{t("groupCard.emptyGroup")}</p>
            </div>
          )}

          {group.tabs.map((tab, index) => {
            const tabId = typeof tab.id === "number" ? tab.id : tab.id || index;
            return (
              <Tab
                key={`group-${group.id}-tab-${tabId}`}
                id={`group-${group.id}-tab-${tabId}`}
                onClick={() => {
                  chrome.tabs.create({ url: tab.url, active: false });
                }}
                tabInfo={tab}
                origin={{ type: "group", id: group.id.toString() }}
                className="w-full shadow-sm hover:shadow-md transition-shadow duration-200 border-none ring-1 ring-slate-200"
              />
            );
          })}
        </SortableContext>
      </div>
    </div>
  );
};

export default GroupCard;
