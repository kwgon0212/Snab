import React from "react";
import { Folder } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { cn } from "@/utils/cn";
import { GroupHeader } from "./GroupHeader";
import { SortableTab } from "./SortableTab";

interface GroupCardProps {
  group: any;
  isEditing: boolean;
  editingName: string;
  onStartEdit: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onNameChange: (name: string) => void;
  onRestore: () => void;
  onDelete: () => void;
  onTabClick: (tab: any) => void;
  onDeleteTab: (groupId: string, tabId: string) => void;
}

export const GroupCard = ({
  group,
  isEditing,
  editingName,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onNameChange,
  onRestore,
  onDelete,
  onTabClick,
  onDeleteTab,
}: GroupCardProps) => {
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
      <GroupHeader
        group={group}
        isEditing={isEditing}
        editingName={editingName}
        onStartEdit={onStartEdit}
        onSaveEdit={onSaveEdit}
        onCancelEdit={onCancelEdit}
        onNameChange={onNameChange}
        onRestore={onRestore}
        onDelete={onDelete}
      />

      <div className="space-y-2">
        {group.tabs.length === 0 ? (
          <div className="text-center py-4 text-slate-400">
            <Folder className="size-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">탭이 없습니다</p>
          </div>
        ) : (
          <SortableContext
            items={group.tabs.map((tab: any) => `sortable-tab-${tab.id}`)}
            strategy={verticalListSortingStrategy}
          >
            {group.tabs.map((tab: any) => (
              <SortableTab
                key={tab.id}
                tab={tab}
                groupId={group.id}
                onTabClick={onTabClick}
                onDeleteTab={onDeleteTab}
              />
            ))}
          </SortableContext>
        )}
      </div>
    </div>
  );
};
