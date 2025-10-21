// 파일/세션 노드 컴포넌트
import React from "react";
import type { SessionLeaf, TreeNode } from "@/types/collection";
import RenameInput from "./RenameInput";
import { FileIcon } from "./icons";
import { cn } from "@/utils/cn";
import { Trash } from "lucide-react";

interface TreeLeafProps {
  node: SessionLeaf;
  depth: number;
  selected: string | null;
  renaming: string | null;
  setSelected: (id: string) => void;
  setRenaming: (id: string | null) => void;
  onRename: (id: string, name: string) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
  onOpenSession: (sessionId: string) => void;
  onDragStart: (e: React.DragEvent, node: TreeNode) => void;
}

export default function TreeLeaf({
  node,
  depth,
  selected,
  renaming,
  setSelected,
  setRenaming,
  onRename,
  onRemove,
  onOpenSession,
  onDragStart,
}: TreeLeafProps) {
  return (
    <div className="relative">
      {/* 세로 가이드 라인 - z-index로 위에 표시 */}
      <div
        className="absolute top-0 bottom-0 w-px bg-gray-300 z-10 pointer-events-none"
        style={{ left: `${depth * 16 - 4}px` }}
      />

      <div
        className={cn(
          "flex items-center gap-2 py-0.5 rounded cursor-pointer hover:bg-blue-100 relative",
          selected === node.id && "bg-blue-100"
        )}
        style={{ paddingLeft: `${depth * 16 + 20}px`, paddingRight: "4px" }}
        onClick={() => setSelected(node.id)}
        onDoubleClick={() => onOpenSession(node.sessionId)}
        draggable
        onDragStart={(e) => onDragStart(e, node)}
      >
        <div className="flex-shrink-0">
          <FileIcon />
        </div>
        {renaming === node.id ? (
          <RenameInput
            initial={node.name}
            onSubmit={async (v) => {
              await onRename(node.id, v);
              setRenaming(null);
            }}
            onCancel={() => setRenaming(null)}
          />
        ) : (
          <span
            className="flex-1 truncate"
            onDoubleClick={() => setRenaming(node.id)}
          >
            {node.name}
          </span>
        )}
        {/* 메타 정보와 액션 버튼들 - rename 중일 때 숨김 */}
        {renaming !== node.id && (
          <>
            {node.meta && (
              <span className="text-[10px] text-gray-500 flex-shrink-0">
                {node.meta.windows}w·{node.meta.tabs}t
              </span>
            )}
            <div className="flex items-center gap-1 flex-shrink-0">
              {/* <button
              className="text-xs px-1 py-0.5 hover:text-blue-600 hover:text-bold rounded"
              onClick={(e) => {
                e.stopPropagation();
                onOpenSession(node.sessionId);
              }}
            >
              열기
            </button> */}
              <button
                className="hover:text-blue-600 hover:text-bold rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(node.id);
                }}
              >
                <Trash className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
