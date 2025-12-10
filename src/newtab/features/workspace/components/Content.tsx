import { useState } from "react";
import SegmentedControl from "@/newtab/components/ui/SegmentedControl";
import GroupListContainer from "../containers/GroupListContainer";
import { useWorkspaceStore } from "@/newtab/store/workspace";

import { Trash2, Edit2, Plus } from "lucide-react";
import EditBlurInput from "@/newtab/components/ui/EditBlurInput";
import Tooltip from "@/newtab/components/ui/Tooltip";
import { useTranslation } from "react-i18next";

const Content = () => {
  const { t } = useTranslation();
  // We can move this state to a container too if we want "ContentContainer",
  // but these seem like UI states specific to this view.
  const { activeWorkspace, updateWorkspace, deleteWorkspace, addGroup } =
    useWorkspaceStore();

  // Use activeWorkspace properties directly
  const groupViewMode = activeWorkspace?.groupViewMode || 1;
  const tabViewMode = activeWorkspace?.tabViewMode || 1;

  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState("");

  // Update editingName when activeWorkspace changes
  if (activeWorkspace && editingName === "" && !isEditing) {
    setEditingName(activeWorkspace.name);
  }

  // Sync editing name if workspace changes externally
  // actually a useEffect is better or just setting it when isEditing becomes true.
  // But EditBlurInput usually takes value and onChange.

  const handleRename = () => {
    if (activeWorkspace && editingName.trim() !== "") {
      updateWorkspace(activeWorkspace.id, { name: editingName });
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (activeWorkspace) {
      deleteWorkspace(activeWorkspace.id);
    }
  };

  if (!activeWorkspace) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-400">
        {t("content.selectWorkspace")}
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full relative min-w-0">
      <div className="flex justify-between items-end px-6 py-4 border-b border-slate-200 dark:border-slate-800 dark:bg-slate-950 transition-colors duration-300">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <EditBlurInput
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              editingName={editingName}
              setEditingName={setEditingName}
              value={activeWorkspace.name}
              onBlur={handleRename}
              className="text-xl font-semibold text-slate-800 dark:text-slate-100 min-w-[200px] tracking-tight bg-transparent"
              aria-label={t("content.rename")}
              maxLength={20}
            />
            <div className="flex items-center gap-1">
              <Tooltip title={t("content.rename")} position="bottom">
                <button
                  onClick={() => {
                    setEditingName(activeWorkspace.name);
                    setIsEditing(true);
                  }}
                  className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                >
                  <Edit2 className="size-4" />
                </button>
              </Tooltip>
              <Tooltip title={t("content.deleteWorkspace")} position="bottom">
                <button
                  onClick={handleDelete}
                  className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="size-4" />
                </button>
              </Tooltip>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-xs text-slate-400">
              {t("content.totalGroups", {
                count: activeWorkspace.groups.length,
              })}{" "}
              ·{" "}
              {t("content.totalTabs", {
                count: activeWorkspace.groups.reduce(
                  (total, group) => total + group.tabs.length,
                  0
                ),
              })}
            </p>
            <div className="w-[1px] h-3 bg-slate-300 dark:bg-slate-700" />
            <button
              onClick={addGroup}
              className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              <Plus className="size-3" />
              <span>{t("content.addGroup")}</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex flex-col items-start gap-1">
            <span className="text-[10px] font-semibold text-slate-400 px-2 uppercase tracking-wide">
              {t("content.groupView")}
            </span>
            <SegmentedControl
              name="group-view"
              options={[
                { value: 1, label: t("content.column1") },
                { value: 2, label: t("content.column2") },
              ]}
              value={groupViewMode}
              onChange={(value) => {
                if (activeWorkspace) {
                  updateWorkspace(activeWorkspace.id, {
                    groupViewMode: value as 1 | 2,
                  });
                }
              }}
            />
          </div>

          <div className="flex flex-col items-start gap-1">
            <span className="text-[10px] font-semibold text-slate-400 px-2 uppercase tracking-wide">
              {t("content.tabView")}
            </span>
            <SegmentedControl
              name="tab-view"
              options={[
                { value: 1, label: t("content.column1") },
                { value: 2, label: t("content.column2") },
                { value: 3, label: t("content.column3") },
              ]}
              value={tabViewMode}
              onChange={(value) => {
                if (activeWorkspace) {
                  updateWorkspace(activeWorkspace.id, {
                    tabViewMode: value as 1 | 2 | 3,
                  });
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-4">
        <GroupListContainer
          groupViewMode={groupViewMode}
          tabViewMode={tabViewMode}
        />
      </div>
    </div>
  );
};

export default Content;
