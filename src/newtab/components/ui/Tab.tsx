import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";
import Divider from "./Divider";
import { X } from "lucide-react";
import { useWorkspaceStore } from "@/newtab/store/workspace";

interface TabProps {
  id: string | number;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  tabInfo: chrome.tabs.Tab;
  origin: {
    type: "window" | "group";
    id: string;
  };
  className?: string;
}

const Tab = ({ id, onClick, tabInfo, origin, className }: TabProps) => {
  const tabId =
    typeof id === "string" ? id : `${origin.type}-${origin.id}-tab-${id}`;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tabId, data: { type: "tab", origin, tabInfo } });

  const { updateWorkspace, activeWorkspace } = useWorkspaceStore();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : "auto",
  };

  const handleCloseTab = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    if (origin.type === "group") {
      // 워크스페이스 그룹에서 온 탭: 그룹에서만 제거 (실제 탭은 유지)
      const workspaceId = activeWorkspace?.id;
      const groupId = origin.id;

      if (!workspaceId || !groupId || !activeWorkspace) {
        console.warn("워크스페이스 또는 그룹 정보가 없습니다.");
        return;
      }

      // 탭 ID 파싱 (group-${groupId}-tab-${tabId} 형식에서 실제 tabId 추출)
      const actualTabId =
        typeof id === "string" ? parseInt(id.split("-tab-")[1] || "0") : id;

      updateWorkspace(workspaceId, {
        groups: activeWorkspace.groups.map((group) =>
          group.id === groupId
            ? {
                ...group,
                tabs: group.tabs.filter((tab) => {
                  const tabIdNum =
                    typeof tab.id === "number"
                      ? tab.id
                      : parseInt(String(tab.id).split("-tab-")[1] || "0");
                  return tabIdNum !== actualTabId;
                }),
              }
            : group
        ),
      });
      return;
    }

    // 윈도우에서 온 탭: 실제 Chrome 탭 제거
    const actualTabId =
      typeof id === "string" ? parseInt(id.split("-tab-")[1] || "0") : id;
    chrome.tabs.remove(actualTabId);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`${className} group hover:shadow-md w-full px-3 py-2 bg-white rounded-md flex items-center gap-2 transition-shadow duration-200 ease-out cursor-pointer`}
      onClick={onClick}
    >
      {tabInfo.favIconUrl ? (
        <img
          src={tabInfo.favIconUrl}
          alt={tabInfo.title}
          className="size-4 rounded-sm drop-shadow-[1px_3px_3px_rgba(0,0,0,0.3)]"
        />
      ) : (
        <div className="size-4 rounded-sm flex items-center justify-center">
          <span className="text-sm text-gray-500">🌐</span>
        </div>
      )}

      <Divider direction="vertical" />

      <span className="text-sm text-gray-500 truncate flex-1 text-start">
        {tabInfo.title}
      </span>

      <button
        onClick={handleCloseTab}
        className="opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-full hover:bg-blue-100 p-1 active:scale-80"
      >
        <X className="size-3 text-blue-500" />
      </button>
    </div>
  );
};

export default Tab;
