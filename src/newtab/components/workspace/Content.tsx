import React, { useState, useEffect } from "react";
import { Plus, Folder, ExternalLink, Trash2, Edit2, X } from "lucide-react";
import {
  createGroup,
  deleteGroup,
  updateGroupName,
  restoreGroupTabs,
  loadWorkspaces,
  reorderGroupTabs,
  type Workspace,
  type Tab,
} from "@/store/workspace";
import { cn } from "@/utils/cn";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface DroppableGroupProps {
  group: any;
  children: React.ReactNode;
}

interface SortableTabProps {
  tab: Tab;
  groupId: string;
  onTabClick: (tab: Tab) => void;
  onDeleteTab: (groupId: string, tabId: string) => void;
  children: React.ReactNode;
}

const SortableTab = ({
  tab,
  groupId,
  onTabClick,
  onDeleteTab,
  children,
}: SortableTabProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `sortable-tab-${tab.id}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-2 p-2 rounded-md hover:bg-slate-50 transition-colors duration-200 group min-w-0 relative",
        isDragging && "opacity-50"
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="flex items-center gap-2 flex-1 cursor-grab active:cursor-grabbing min-w-0"
        onClick={() => onTabClick(tab)}
      >
        {children}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDeleteTab(groupId, tab.id);
        }}
        className="absolute -right-1 -top-1 opacity-0 group-hover:opacity-100 transition-all duration-300 p-1 rounded-full bg-red-500 hover:bg-red-600 shadow-sm"
        title="탭 삭제"
      >
        <X className="size-2.5 text-white" />
      </button>
    </div>
  );
};

const DroppableGroup = ({ group, children }: DroppableGroupProps) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `droppable-group-${group.id}`,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "bg-white rounded-lg border border-slate-200 py-2 px-4 hover:shadow-sm transition-all duration-200 group-card h-fit break-inside-avoid mb-4 overflow-hidden",
        isOver && "border-blue-400 bg-blue-50"
      )}
    >
      {children}
    </div>
  );
};

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

  const updateTabOrder = async (groupId: string, tabIds: string[]) => {
    if (!activeWorkspace) return;
    try {
      const success = await reorderGroupTabs(
        activeWorkspace.id,
        groupId,
        tabIds
      );
      if (success && onWorkspaceUpdate) {
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
            <DroppableGroup key={group.id} group={group}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Folder className="size-5 text-blue-500" />
                  {editingGroupId === group.id ? (
                    <input
                      type="text"
                      value={editingGroupName}
                      onChange={(e) => setEditingGroupName(e.target.value)}
                      onBlur={handleSaveGroupEdit}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveGroupEdit();
                        if (e.key === "Escape") handleCancelGroupEdit();
                      }}
                      className="text-sm font-semibold bg-transparent border-none outline-none"
                      autoFocus
                    />
                  ) : (
                    <h3 className="font-semibold text-slate-800">
                      {group.name}
                    </h3>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-1">
                    {editingGroupId !== group.id && (
                      <button
                        onClick={() =>
                          handleStartEditGroup(group.id, group.name)
                        }
                        className="p-1 text-slate-400 hover:text-slate-600 hover:scale-110 rounded-lg transition-all duration-200"
                        title="그룹명 수정"
                      >
                        <Edit2 className="size-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleRestoreGroup(group.id)}
                      className="p-1 text-slate-400 hover:text-blue-500 hover:scale-110 rounded-lg transition-all duration-200"
                      title="그룹 복원"
                    >
                      <ExternalLink className="size-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteGroup(group.id, group.name)}
                      className="p-1 text-slate-400 hover:text-red-500 hover:scale-110 rounded-lg transition-all duration-200"
                      title="그룹 삭제"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {group.tabs.length === 0 ? (
                  <div className="text-center py-4 text-slate-400">
                    <Folder className="size-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">탭이 없습니다</p>
                  </div>
                ) : (
                  <SortableContext
                    items={group.tabs.map((tab) => `sortable-tab-${tab.id}`)}
                    strategy={verticalListSortingStrategy}
                  >
                    {group.tabs.map((tab) => (
                      <SortableTab
                        key={tab.id}
                        tab={tab}
                        groupId={group.id}
                        onTabClick={handleTabClick}
                        onDeleteTab={handleDeleteTab}
                      >
                        {tab.favIconUrl ? (
                          <img
                            src={tab.favIconUrl}
                            alt=""
                            className="size-4 rounded-sm flex-shrink-0"
                            style={{
                              filter:
                                "drop-shadow(0 0 0.1px rgba(0,0,0,0.6)) drop-shadow(0 0 1px rgba(0,0,0,0.35))",
                            }}
                          />
                        ) : (
                          <div className="size-4 rounded-sm bg-slate-200 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs">🌐</span>
                          </div>
                        )}
                        <span className="text-sm truncate flex-1 min-w-0">
                          {tab.title}
                        </span>
                      </SortableTab>
                    ))}
                  </SortableContext>
                )}
              </div>
            </DroppableGroup>
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
