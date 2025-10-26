import React, { useState, useEffect } from "react";
import { Plus, Folder, Settings, Edit2, Trash2 } from "lucide-react";
import {
  loadWorkspaces,
  createWorkspace,
  deleteWorkspace,
  saveWorkspace,
  type Workspace,
} from "@/store/workspace";
import { cn } from "@/utils/cn";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableWorkspaceItemProps {
  workspace: Workspace;
  isActive: boolean;
  isEditing: boolean;
  editingName: string;
  onWorkspaceClick: (id: string) => void;
  onStartEdit: (workspace: Workspace) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onNameChange: (name: string) => void;
  onDelete: (id: string, name: string) => void;
}

const SortableWorkspaceItem = ({
  workspace,
  isActive,
  isEditing,
  editingName,
  onWorkspaceClick,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onNameChange,
  onDelete,
}: SortableWorkspaceItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: workspace.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-200 group",
        isActive
          ? "bg-blue-100 text-blue-500"
          : "text-slate-600 hover:bg-slate-200",
        isDragging && "opacity-50"
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
      >
        <Folder className="size-4" />
      </div>

      {isEditing ? (
        <input
          type="text"
          value={editingName}
          onChange={(e) => onNameChange(e.target.value)}
          onBlur={onSaveEdit}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSaveEdit();
            if (e.key === "Escape") onCancelEdit();
          }}
          className="flex-1 text-sm bg-transparent border-none outline-none"
          autoFocus
        />
      ) : (
        <>
          <span
            className="text-sm font-medium truncate flex-1 cursor-pointer"
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.stopPropagation();
              onWorkspaceClick(workspace.id);
            }}
          >
            {workspace.name}
          </span>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStartEdit(workspace);
              }}
              className="p-1 text-slate-400 hover:text-slate-600 hover:scale-110 rounded transition-all duration-200"
              title="이름 수정"
            >
              <Edit2 className="size-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(workspace.id, workspace.name);
              }}
              className="p-1 text-slate-400 hover:text-red-600 hover:scale-110 rounded transition-all duration-200"
              title="워크스페이스 삭제"
            >
              <Trash2 className="size-3" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

interface SidebarProps {
  onWorkspaceChange: (workspace: Workspace | null) => void;
}

const Sidebar = ({ onWorkspaceChange }: SidebarProps) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>("default");
  const [editingWorkspaceId, setEditingWorkspaceId] = useState<string | null>(
    null
  );
  const [editingName, setEditingName] = useState<string>("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadWorkspaceData();
  }, []);

  // workspace-updated 이벤트 리스너
  useEffect(() => {
    const handleWorkspaceUpdated = () => {
      loadWorkspaceData();
    };

    window.addEventListener("workspace-updated", handleWorkspaceUpdated);

    return () => {
      window.removeEventListener("workspace-updated", handleWorkspaceUpdated);
    };
  }, []);

  const loadWorkspaceData = async () => {
    try {
      const data = await loadWorkspaces();
      setWorkspaces(data);

      // 첫 번째 워크스페이스를 자동으로 선택
      if (data.length > 0) {
        setActiveWorkspaceId(data[0].id);
        onWorkspaceChange(data[0]);
      }
    } catch (error) {
      console.error("워크스페이스 불러오기 실패:", error);
    }
  };

  const handleCreateWorkspace = async () => {
    try {
      const newWorkspace = await createWorkspace("새 워크스페이스");
      if (newWorkspace) {
        setWorkspaces((prev) => [...prev, newWorkspace]);
        setActiveWorkspaceId(newWorkspace.id);
        onWorkspaceChange(newWorkspace);
        setEditingWorkspaceId(newWorkspace.id);
        setEditingName(newWorkspace.name);
      }
    } catch (error) {
      console.error("워크스페이스 생성 실패:", error);
    }
  };

  const handleStartEdit = (workspace: Workspace) => {
    setEditingWorkspaceId(workspace.id);
    setEditingName(workspace.name);
  };

  const handleWorkspaceClick = (workspaceId: string) => {
    console.log("워크스페이스 클릭됨:", workspaceId);
    setActiveWorkspaceId(workspaceId);
    const workspace = workspaces.find((w) => w.id === workspaceId);
    console.log("찾은 워크스페이스:", workspace);
    onWorkspaceChange(workspace || null);
  };

  const handleSaveEdit = async () => {
    if (editingWorkspaceId && editingName.trim()) {
      try {
        const updatedWorkspaces = workspaces.map((workspace) =>
          workspace.id === editingWorkspaceId
            ? { ...workspace, name: editingName.trim() }
            : workspace
        );

        setWorkspaces(updatedWorkspaces);

        // 저장소에 저장
        const workspaceToSave = updatedWorkspaces.find(
          (w) => w.id === editingWorkspaceId
        );
        if (workspaceToSave) {
          await saveWorkspace(workspaceToSave);

          // 워크스페이스 업데이트 이벤트 발생
          window.dispatchEvent(new CustomEvent("workspace-updated"));

          // 현재 활성 워크스페이스인 경우 부모 컴포넌트에 업데이트된 워크스페이스 전달
          if (activeWorkspaceId === editingWorkspaceId) {
            onWorkspaceChange(workspaceToSave);
          }
        }

        setEditingWorkspaceId(null);
        setEditingName("");
      } catch (error) {
        console.error("워크스페이스 이름 수정 실패:", error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingWorkspaceId(null);
    setEditingName("");
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = workspaces.findIndex((w) => w.id === active.id);
      const newIndex = workspaces.findIndex((w) => w.id === over.id);

      const newWorkspaces = arrayMove(workspaces, oldIndex, newIndex);
      setWorkspaces(newWorkspaces);

      // 저장소에 새로운 순서 저장
      try {
        await chrome.storage.local.set({ workspaces: newWorkspaces });
      } catch (error) {
        console.error("워크스페이스 순서 저장 실패:", error);
      }
    }
  };

  const handleDeleteWorkspace = async (
    workspaceId: string,
    workspaceName: string
  ) => {
    if (workspaces.length <= 1) {
      alert("최소 하나의 워크스페이스는 유지되어야 합니다.");
      return;
    }

    if (
      confirm(
        `"${workspaceName}" 워크스페이스를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`
      )
    ) {
      try {
        const success = await deleteWorkspace(workspaceId);
        if (success) {
          const updatedWorkspaces = workspaces.filter(
            (w) => w.id !== workspaceId
          );
          setWorkspaces(updatedWorkspaces);

          // 삭제된 워크스페이스가 현재 활성 워크스페이스인 경우 첫 번째 워크스페이스로 전환
          if (activeWorkspaceId === workspaceId) {
            if (updatedWorkspaces.length > 0) {
              const firstWorkspace = updatedWorkspaces[0];
              setActiveWorkspaceId(firstWorkspace.id);
              onWorkspaceChange(firstWorkspace);
            }
          }
        }
      } catch (error) {
        console.error("워크스페이스 삭제 실패:", error);
        alert("워크스페이스 삭제에 실패했습니다.");
      }
    }
  };

  return (
    <div className="w-full h-full bg-slate-50 p-4 flex flex-col gap-2">
      <h2 className="text-lg font-semibold text-slate-800 mb-2">Workspace</h2>
      <button
        onClick={handleCreateWorkspace}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-200 rounded-md transition-colors duration-200"
      >
        <Plus className="size-4" />새 워크스페이스
      </button>

      <div className="border-t border-slate-200"></div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={workspaces.map((w) => w.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-1 flex-1 overflow-y-auto">
            {workspaces.map((workspace) => (
              <SortableWorkspaceItem
                key={workspace.id}
                workspace={workspace}
                isActive={activeWorkspaceId === workspace.id}
                isEditing={editingWorkspaceId === workspace.id}
                editingName={editingName}
                onWorkspaceClick={handleWorkspaceClick}
                onStartEdit={handleStartEdit}
                onSaveEdit={handleSaveEdit}
                onCancelEdit={handleCancelEdit}
                onNameChange={setEditingName}
                onDelete={handleDeleteWorkspace}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default Sidebar;
