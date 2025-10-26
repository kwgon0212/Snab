import React from "react";
import { Folder, Edit2, ExternalLink, Trash2 } from "lucide-react";

interface GroupHeaderProps {
  group: any;
  isEditing: boolean;
  editingName: string;
  onStartEdit: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onNameChange: (name: string) => void;
  onRestore: () => void;
  onDelete: () => void;
}

export const GroupHeader = ({
  group,
  isEditing,
  editingName,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onNameChange,
  onRestore,
  onDelete,
}: GroupHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <Folder className="size-5 text-blue-500" />
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
            className="text-sm font-semibold bg-transparent border-none outline-none"
            autoFocus
          />
        ) : (
          <h3 className="font-semibold text-slate-800">{group.name}</h3>
        )}
      </div>
      <div className="flex items-center gap-1">
        {!isEditing && (
          <>
            <button
              onClick={onStartEdit}
              className="p-1 text-slate-400 hover:text-slate-600 hover:scale-110 rounded-lg transition-all duration-200"
              title="그룹명 수정"
            >
              <Edit2 className="size-4" />
            </button>
            <button
              onClick={onRestore}
              className="p-1 text-slate-400 hover:text-blue-500 hover:scale-110 rounded-lg transition-all duration-200"
              title="그룹 복원"
            >
              <ExternalLink className="size-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-1 text-slate-400 hover:text-red-500 hover:scale-110 rounded-lg transition-all duration-200"
              title="그룹 삭제"
            >
              <Trash2 className="size-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
