import { useState, useEffect } from "react";
import { Plus, Folder } from "lucide-react";
import {
  createGroup,
  deleteGroup,
  updateGroupName,
  restoreGroupTabs,
  loadWorkspaces,
  type Workspace,
  type Tab,
} from "@/store/workspace";
import { GroupCard } from "./GroupCard";

interface ContentProps {
  activeWorkspace: Workspace | null;
  onWorkspaceUpdate?: (workspace: Workspace | null) => void;
}

const Content = ({ activeWorkspace, onWorkspaceUpdate }: ContentProps) => {
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingGroupName, setEditingGroupName] = useState("");

  // 워크스페이스 업데이트 이벤트 리스너
  useEffect(() => {
    const handleWorkspaceUpdate = async () => {
      if (activeWorkspace && onWorkspaceUpdate) {
        const updatedWorkspaces = await loadWorkspaces();
        const updatedWorkspace = updatedWorkspaces.find(
          (w) => w.id === activeWorkspace.id
        );
        if (updatedWorkspace) {
          onWorkspaceUpdate(updatedWorkspace);
        }
      }
    };

    window.addEventListener("workspace-updated", handleWorkspaceUpdate);

    return () => {
      window.removeEventListener("workspace-updated", handleWorkspaceUpdate);
    };
  }, [activeWorkspace, onWorkspaceUpdate]);

  const handleCreateGroup = async () => {
    if (!activeWorkspace) return;

    setIsCreatingGroup(true);
    setNewGroupName("새 그룹");
  };

  const handleSaveNewGroup = async () => {
    if (!activeWorkspace || !newGroupName.trim()) {
      setIsCreatingGroup(false);
      setNewGroupName("");
      return;
    }

    try {
      await createGroup(activeWorkspace.id, newGroupName.trim());
      setIsCreatingGroup(false);
      setNewGroupName("");

      // 워크스페이스 데이터 새로고침
      const updatedWorkspaces = await loadWorkspaces();
      const updatedWorkspace = updatedWorkspaces.find(
        (w) => w.id === activeWorkspace.id
      );
      if (updatedWorkspace && onWorkspaceUpdate) {
        onWorkspaceUpdate(updatedWorkspace);
      }
    } catch (error) {
      // 에러 발생 시 조용히 처리
    }
  };

  const handleCancelNewGroup = () => {
    setIsCreatingGroup(false);
    setNewGroupName("");
  };

  const handleRestoreGroup = async (groupId: string) => {
    if (!activeWorkspace) return;

    try {
      await restoreGroupTabs(groupId, activeWorkspace.id);
    } catch (error) {
      // 에러 발생 시 조용히 처리
    }
  };

  const handleDeleteGroup = async (groupId: string, groupName: string) => {
    if (!activeWorkspace) return;

    if (
      confirm(
        `"${groupName}" 그룹을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`
      )
    ) {
      try {
        const success = await deleteGroup(activeWorkspace.id, groupId);
        if (success) {
          // 워크스페이스 데이터 새로고침
          const updatedWorkspaces = await loadWorkspaces();
          const updatedWorkspace = updatedWorkspaces.find(
            (w) => w.id === activeWorkspace.id
          );
          if (updatedWorkspace && onWorkspaceUpdate) {
            onWorkspaceUpdate(updatedWorkspace);
          }
        }
      } catch (error) {
        // 에러 발생 시 조용히 처리
        alert("그룹 삭제에 실패했습니다.");
      }
    }
  };

  const handleStartEditGroup = (groupId: string, currentName: string) => {
    setEditingGroupId(groupId);
    setEditingGroupName(currentName);
  };

  const handleSaveGroupEdit = async () => {
    if (!activeWorkspace || !editingGroupId || !editingGroupName.trim()) {
      setEditingGroupId(null);
      setEditingGroupName("");
      return;
    }

    try {
      const success = await updateGroupName(
        activeWorkspace.id,
        editingGroupId,
        editingGroupName.trim()
      );
      if (success) {
        // 워크스페이스 데이터 새로고침
        const updatedWorkspaces = await loadWorkspaces();
        const updatedWorkspace = updatedWorkspaces.find(
          (w) => w.id === activeWorkspace.id
        );
        if (updatedWorkspace && onWorkspaceUpdate) {
          onWorkspaceUpdate(updatedWorkspace);
        }
      }
      setEditingGroupId(null);
      setEditingGroupName("");
    } catch (error) {
      // 에러 발생 시 조용히 처리
    }
  };

  const handleCancelGroupEdit = () => {
    setEditingGroupId(null);
    setEditingGroupName("");
  };

  const handleTabClick = async (tab: Tab) => {
    try {
      // 새 탭으로 열기
      await chrome.tabs.create({
        url: tab.url,
        active: true,
      });
    } catch (error) {
      // 에러 발생 시 조용히 처리
    }
  };

  const handleDeleteTab = async (groupId: string, tabId: string) => {
    if (!activeWorkspace) return;

    try {
      const { removeTabFromGroup } = await import("@/store/workspace");
      await removeTabFromGroup(activeWorkspace.id, groupId, tabId);

      if (onWorkspaceUpdate) {
        const updatedWorkspaces = await loadWorkspaces();
        const updatedWorkspace = updatedWorkspaces.find(
          (w) => w.id === activeWorkspace.id
        );
        if (updatedWorkspace) {
          onWorkspaceUpdate(updatedWorkspace);
        }
      }
    } catch (error) {
      // 에러 발생 시 조용히 처리
    }
  };

  if (!activeWorkspace) {
    return (
      <div className="flex-1 size-full p-2 bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Folder className="size-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-600 mb-2">
            워크스페이스를 선택하세요
          </h2>
          <p className="text-slate-500">
            왼쪽 사이드바에서 워크스페이스를 선택하여 시작하세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 size-full px-8 py-4 bg-slate-50 flex flex-col gap-4 min-w-[600px] overflow-hidden">
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            {activeWorkspace.name}
          </h1>
          <p className="text-slate-600">
            {activeWorkspace.groups.length}개의 그룹 • 총{" "}
            {activeWorkspace.groups.reduce(
              (sum, group) => sum + group.tabs.length,
              0
            )}
            개의 탭
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCreateGroup}
            className="flex justify-center items-center gap-2 bg-blue-500 hover:bg-blue-600 active:scale-95 px-4 py-2 transition-all duration-200 rounded-md text-white shadow-sm hover:shadow-md"
          >
            <Plus className="size-4" />새 그룹
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="columns-2 gap-4 pb-8">
          {activeWorkspace.groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              isEditing={editingGroupId === group.id}
              editingName={editingGroupName}
              onStartEdit={() => handleStartEditGroup(group.id, group.name)}
              onSaveEdit={handleSaveGroupEdit}
              onCancelEdit={handleCancelGroupEdit}
              onNameChange={setEditingGroupName}
              onRestore={() => handleRestoreGroup(group.id)}
              onDelete={() => handleDeleteGroup(group.id, group.name)}
              onTabClick={handleTabClick}
              onDeleteTab={handleDeleteTab}
            />
          ))}

          {/* 새 그룹 생성 아코디언 */}
          {isCreatingGroup && (
            <div className="bg-white rounded-lg border border-blue-200 p-4 shadow-sm break-inside-avoid mb-4">
              <div className="flex items-center gap-3">
                <Folder className="size-5 text-blue-500" />
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  onBlur={handleSaveNewGroup}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveNewGroup();
                    if (e.key === "Escape") handleCancelNewGroup();
                  }}
                  className="flex-1 text-sm font-medium bg-transparent border-none outline-none"
                  autoFocus
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Content;
