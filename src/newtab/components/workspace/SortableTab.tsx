import React from "react";
import { X } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/utils/cn";
import { TabItem } from "./TabItem";
import type { Tab } from "@/store/workspace";

interface SortableTabProps {
  tab: Tab;
  groupId: string;
  onTabClick: (tab: Tab) => void;
  onDeleteTab: (groupId: string, tabId: string) => void;
}

export const SortableTab = ({
  tab,
  groupId,
  onTabClick,
  onDeleteTab,
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
        <TabItem
          tab={tab}
          onTabClick={onTabClick}
          onDelete={() => onDeleteTab(groupId, tab.id)}
        />
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
