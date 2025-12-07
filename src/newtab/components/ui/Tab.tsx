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

      // URL을 기준으로 탭을 찾아서 제거 (그룹에 저장된 탭은 스냅샷일 수 있어 URL 기반이 더 안정적)
      const tabUrl = tabInfo.url;

      if (!tabUrl) {
        console.warn("탭 URL이 없습니다.");
        return;
      }

      updateWorkspace(workspaceId, {
        groups: activeWorkspace.groups.map((group) =>
          group.id === groupId
            ? {
                ...group,
                tabs: group.tabs.filter((tab) => tab.url !== tabUrl),
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
      className={`${className} group hover:shadow-md w-full px-3 py-2 bg-white dark:bg-slate-800 dark:hover:bg-slate-700 rounded-md flex items-center gap-2 transition-all duration-200 ease-out cursor-pointer dark:text-slate-200 ring-1 ring-slate-200 dark:ring-slate-700`}
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

      <span className="text-sm text-gray-500 dark:text-slate-300 truncate flex-1 text-start">
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
