import { AppWindowMac, Edit2, Group, Plus, Trash2 } from "lucide-react";
import Groups from "./Groups";
import { useWorkspaceStore } from "@/newtab/store/workspace";
import type { WorkspaceGroup } from "@/newtab/types/workspace";
import Divider from "../../ui/Divider";
import { useState } from "react";
import EditBlurInput from "../../ui/EditBlurInput";

const Content = () => {
  const { activeWorkspace, deleteWorkspace, updateWorkspace } =
    useWorkspaceStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState(activeWorkspace?.name || "");

  const groupViewMode = activeWorkspace?.groupViewMode ?? 1;
  const tabViewMode = activeWorkspace?.tabViewMode ?? 1;

  const handleTabViewMode = () => {
    if (!activeWorkspace) return;

    const newMode = tabViewMode === 3 ? 1 : ((tabViewMode + 1) as 1 | 2 | 3);
    updateWorkspace(activeWorkspace.id, { tabViewMode: newMode });
  };

  const handleGroupViewMode = () => {
    if (!activeWorkspace) return;

    const newMode = groupViewMode === 2 ? 1 : ((groupViewMode + 1) as 1 | 2);
    updateWorkspace(activeWorkspace.id, { groupViewMode: newMode });
  };

  const handleAddGroup = () => {
    if (!activeWorkspace) return;

    const group: WorkspaceGroup = {
      id: crypto.randomUUID(),
      name: "새 그룹 " + (activeWorkspace.groups.length + 1),
      tabs: [],
    };

    updateWorkspace(activeWorkspace.id, {
      groups: [...activeWorkspace.groups, group],
    });
  };

  const clickEditWorkspaceName = () => {
    if (!activeWorkspace) return;
    setEditingName(activeWorkspace.name);
    setIsEditing(true);
  };

  const handleEditWorkspaceName = () => {
    if (!activeWorkspace) return;

    let trimmedName = editingName.trim();

    if (trimmedName.length > 20) {
      alert("워크스페이스 이름은 20자 이하로 입력해주세요.");
      trimmedName = trimmedName.slice(0, 20);
    }

    if (trimmedName && trimmedName !== activeWorkspace.name) {
      updateWorkspace(activeWorkspace.id, { name: trimmedName });
    } else {
      // 빈 값이거나 변경사항이 없으면 원래 값으로 복원
      setEditingName(activeWorkspace.name);
    }
    setIsEditing(false);
  };

  if (!activeWorkspace) return null;

  return (
    <div className="flex-1 p-4 flex flex-col gap-2 relative w-full min-w-[420px]">
      <div className="flex justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <EditBlurInput
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            editingName={editingName}
            setEditingName={setEditingName}
            value={activeWorkspace.name}
            onBlur={handleEditWorkspaceName}
            className="text-lg"
          />
          <div className="flex items-center gap-1">
            <button
              onClick={clickEditWorkspaceName}
              className="p-1 text-slate-400 hover:text-slate-600 hover:scale-110 rounded-lg transition-all duration-200"
              title="그룹명 수정"
            >
              <Edit2 className="size-3" />
            </button>
            <button
              onClick={() => deleteWorkspace(activeWorkspace.id)}
              className="p-1 text-slate-400 hover:text-red-500 hover:scale-110 rounded-lg transition-all duration-200"
              title="워크스페이스 삭제"
            >
              <Trash2 className="size-3" />
            </button>
          </div>
        </div>
        <button
          onClick={handleAddGroup}
          className="group flex items-center gap-0 px-3 py-2 bg-blue-500 hover:bg-blue-600 active:scale-95 text-white rounded-full transition-all duration-200 font-medium shadow-sm hover:shadow-md overflow-hidden"
        >
          <Plus className="size-4" />
          <span className="opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap group-hover:ml-2 max-w-0 group-hover:max-w-20 overflow-hidden">
            새 그룹
          </span>
        </button>
      </div>
      <div className="w-full flex justify-between">
        <span className="text-xs text-slate-500">
          {activeWorkspace.groups.length}개의 그룹 • 총{" "}
          {activeWorkspace.groups.reduce(
            (acc, group) => acc + group.tabs.length,
            0
          )}
          개의 탭
        </span>
        <span className="text-xs text-slate-400">
          {new Date(activeWorkspace.createdAt).toLocaleString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </span>
      </div>

      <Divider direction="horizontal" className="my-2" />

      <div className="flex justify-end gap-2">
        <button
          onClick={handleGroupViewMode}
          className="flex items-center gap-1 px-4 py-2 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-95 transition-all duration-200"
        >
          <Group className="size-3" />
          그룹 <b className="w-1 text-center">{groupViewMode}</b>열로 보기
        </button>
        <button
          onClick={handleTabViewMode}
          className="flex items-center gap-1 px-4 py-2 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-95 transition-all duration-200"
        >
          <AppWindowMac className="size-3" /> 탭{" "}
          <b className="w-1 text-center">{tabViewMode}</b>
          열로 보기
        </button>
      </div>

      <Groups groupViewMode={groupViewMode} tabViewMode={tabViewMode} />
    </div>
  );
};

export default Content;
