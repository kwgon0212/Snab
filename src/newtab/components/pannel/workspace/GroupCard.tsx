import {
  CornerRightDown,
  Edit2,
  ExternalLink,
  File,
  Folder,
  Trash2,
} from "lucide-react";
import Tab from "../../ui/Tab";
import { useDroppable, useDndContext } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { useWorkspaceStore } from "@/newtab/store/workspace";
import type { WorkspaceGroup } from "@/newtab/types/workspace";
import EditBlurInput from "../../ui/EditBlurInput";
import { useState } from "react";
import { cn } from "@/utils/cn";

const GroupCard = ({
  group,
  tabViewMode,
}: {
  group: WorkspaceGroup;

  tabViewMode: 1 | 2 | 3;
}) => {
  const { updateWorkspace, activeWorkspace } = useWorkspaceStore();
  const { setNodeRef, isOver } = useDroppable({
    id: `group-${group.id}`,
    data: {
      type: "group",
      id: group.id,
      workspaceId: activeWorkspace!.id,
      name: group.name,
      tabs: group.tabs,
    },
  });

  const { active } = useDndContext();
  const activeOrigin = active?.data.current?.origin;

  // 같은 origin(같은 그룹)에서 드래그하면 오버레이 숨김
  const shouldShowOverlay =
    isOver &&
    (!activeOrigin ||
      activeOrigin.type !== "group" ||
      activeOrigin.id !== group.id.toString());

  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState(group.name);

  const clickEditGroupName = () => {
    if (!group) return;
    setEditingName(group.name);
    setIsEditing(true);
  };

  const handleEditGroupName = () => {
    if (!group || !activeWorkspace) return;
    let trimmedName = editingName.trim();

    if (trimmedName.length > 20) {
      alert("그룹 이름은 20자 이하로 입력해주세요.");
      trimmedName = trimmedName.slice(0, 20);
    }

    if (trimmedName && trimmedName !== group.name) {
      // 그룹 목록을 업데이트
      const updatedGroups = activeWorkspace.groups.map((g) =>
        g.id === group.id ? { ...g, name: trimmedName } : g
      );

      updateWorkspace(activeWorkspace.id, {
        groups: updatedGroups,
      });
    } else {
      // 빈 값이거나 변경사항이 없으면 원래 값으로 복원
      setEditingName(group.name);
    }
    setIsEditing(false);
  };

  const handleOpenGroup = async () => {
    if (!group.tabs.length) {
      alert("탭이 없습니다");
      return;
    }
    const newWindow = await chrome.windows.create({});
    if (newWindow && newWindow.id) {
      // 첫 번째 탭을 새로 생성된 윈도우로 이동
      await chrome.tabs.create({
        windowId: newWindow.id,
        url: group.tabs[0].url,
      });

      // 나머지 탭들을 순차적으로 생성
      for (let i = 1; i < group.tabs.length; i++) {
        await chrome.tabs.create({
          windowId: newWindow.id,
          url: group.tabs[i].url,
        });
      }
    }
  };

  const handleDeleteGroup = () => {
    const result = confirm("정말 삭제하시겠습니까?");
    if (!result) return;
    updateWorkspace(activeWorkspace?.id || "", {
      groups: activeWorkspace?.groups.filter((g) => g.id !== group.id) || [],
    });
  };

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "w-full flex flex-col bg-white rounded-lg border border-slate-200 h-fit break-inside-avoid overflow-hidden relative",
        shouldShowOverlay && "border-blue-500 border-dashed"
      )}
    >
      <div
        className={cn(
          "absolute text-blue-500 flex items-center justify-center text-center top-0 left-0 w-full h-full bg-blue-50/90 z-10 transition-all duration-200",
          shouldShowOverlay
            ? "opacity-100 pointer-events-auto scale-100"
            : "opacity-0 pointer-events-none scale-95"
        )}
      >
        <p className="text-sm flex items-center gap-2">
          여기에 탭을 Drop하세요
          <CornerRightDown className="size-4" />
        </p>
      </div>

      <div className="flex items-center justify-between gap-2 w-full px-4 py-2 min-w-0">
        <Folder
          className="size-5 text-blue-500 flex-shrink-0"
          strokeWidth={1.5}
        />

        <EditBlurInput
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          editingName={editingName}
          setEditingName={setEditingName}
          value={group.name}
          onBlur={handleEditGroupName}
          className="flex-1 min-w-0 w-full text-sm truncate"
        />

        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={clickEditGroupName}
            className="p-1 text-slate-400 hover:text-slate-600 hover:scale-110 rounded-lg transition-all duration-200"
            title="그룹명 수정"
          >
            <Edit2 className="size-3" />
          </button>
          <button
            onClick={handleOpenGroup}
            className="p-1 text-slate-400 hover:text-blue-500 hover:scale-110 rounded-lg transition-all duration-200"
            title="새 윈도우에서 모두 열기"
          >
            <ExternalLink className="size-3" />
          </button>
          <button
            onClick={handleDeleteGroup}
            className="p-1 text-slate-400 hover:text-red-500 hover:scale-110 rounded-lg transition-all duration-200"
            title="그룹 삭제"
          >
            <Trash2 className="size-3" />
          </button>
        </div>
      </div>

      <div
        className={cn(
          "bg-slate-100 p-2 grid gap-2",
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
                "text-center flex justify-center items-center gap-2 py-2 text-slate-400",
                tabViewMode === 1 && "col-span-1",
                tabViewMode === 2 && "col-span-2",
                tabViewMode === 3 && "col-span-3"
              )}
            >
              <File className="size-4 opacity-50" />
              <p className="text-sm">탭이 없습니다</p>
            </div>
          )}

          {group.tabs.map((tab, index) => {
            const tabId = typeof tab.id === "number" ? tab.id : tab.id || index;
            return (
              <Tab
                key={`group-${group.id}-tab-${tabId}`}
                id={`group-${group.id}-tab-${tabId}`}
                onClick={() => {}}
                tabInfo={tab}
                origin={{ type: "group", id: group.id.toString() }}
                className="w-full"
              />
            );
          })}
        </SortableContext>
      </div>
    </div>
  );
};

export default GroupCard;
