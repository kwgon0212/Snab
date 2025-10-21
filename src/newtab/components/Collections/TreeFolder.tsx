// 폴더 노드 컴포넌트 (재귀)
import React from "react";
import type { FolderNode, SessionLeaf, TreeNode } from "@/types/collection";
import RenameInput from "./RenameInput";
import TreeLeaf from "./TreeLeaf";
import { Chevron, FolderIcon } from "./icons";
import { cn } from "@/utils/cn";
import { FilePlus, FolderPlus, Trash } from "lucide-react";

interface TreeFolderProps {
  node: FolderNode;
  depth: number;
  selected: string | null;
  renaming: string | null;
  setSelected: (id: string) => void;
  setRenaming: (id: string | null) => void;
  onToggle: (id: string) => void;
  onRename: (id: string, name: string) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
  onNewFolder: (parentId: string) => Promise<void>;
  onNewSession: (
    parentId: string,
    sessionId: string,
    meta?: SessionLeaf["meta"]
  ) => Promise<void>;
  onOpenSession: (sessionId: string) => void;
  onDragStart: (e: React.DragEvent, node: TreeNode) => void;
  onDropFolder: (e: React.DragEvent, dest: FolderNode) => void;
}

export default function TreeFolder(props: TreeFolderProps) {
  const {
    node,
    depth,
    selected,
    renaming,
    setSelected,
    setRenaming,
    onToggle,
    onRename,
    onRemove,
    onNewFolder,
    onNewSession,
    onOpenSession,
    onDragStart,
    onDropFolder,
  } = props;

  return (
    <div className="relative">
      {/* 세로 가이드 라인 - z-index로 위에 표시 */}
      {depth > 0 && (
        <div
          className="absolute top-0 bottom-0 w-px bg-gray-300 z-10 pointer-events-none"
          style={{ left: `${depth * 16 - 4}px` }}
        />
      )}

      {/* 폴더 헤더 */}
      <div
        className={cn(
          "flex items-center gap-1 py-0.5 rounded cursor-pointer hover:bg-blue-100 relative",
          selected === node.id && "bg-blue-100"
        )}
        style={{ paddingLeft: `${depth * 16 + 4}px`, paddingRight: "4px" }}
        onClick={() => onToggle(node.id)}
        draggable
        onDragStart={(e) => onDragStart(e, node)}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
        }}
        onDrop={(e) => onDropFolder(e, node)}
      >
        <div className="flex-shrink-0">
          <Chevron open={!!node.expanded} />
        </div>
        <div className="flex-shrink-0">
          <FolderIcon />
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
        {/* 액션 버튼들 - rename 중일 때 숨김 */}
        {renaming !== node.id && (
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              className="hover:text-blue-600 hover:text-bold rounded"
              onClick={(e) => {
                e.stopPropagation();
                onNewFolder(node.id);
              }}
            >
              <FolderPlus className="w-4 h-4" strokeWidth={1.5} />
            </button>
            <button
              className="hover:text-blue-600 hover:text-bold rounded"
              onClick={(e) => {
                e.stopPropagation();
                onNewSession(node.id, "__placeholder__");
              }}
            >
              <FilePlus className="w-4 h-4" strokeWidth={1.5} />
            </button>
            {node.id !== "root" && (
              <button
                className="hover:text-blue-600 hover:text-bold rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(node.id);
                }}
              >
                <Trash className="w-4 h-4" strokeWidth={1.5} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* 자식 노드들 */}
      {node.expanded && (
        <div className="mt-1 space-y-1">
          {node.children.map((c) =>
            c.type === "folder" ? (
              <TreeFolder
                key={c.id}
                node={c}
                depth={depth + 1}
                selected={selected}
                renaming={renaming}
                setSelected={setSelected}
                setRenaming={setRenaming}
                onToggle={onToggle}
                onRename={onRename}
                onRemove={onRemove}
                onNewFolder={onNewFolder}
                onNewSession={onNewSession}
                onOpenSession={onOpenSession}
                onDragStart={onDragStart}
                onDropFolder={onDropFolder}
              />
            ) : (
              <TreeLeaf
                key={c.id}
                node={c}
                depth={depth + 1}
                selected={selected}
                setSelected={setSelected}
                renaming={renaming}
                setRenaming={setRenaming}
                onRename={onRename}
                onRemove={onRemove}
                onOpenSession={onOpenSession}
                onDragStart={onDragStart}
              />
            )
          )}
          {node.children.length === 0 && (
            <div className="ml-6 text-xs text-gray-400 py-1">비어있음</div>
          )}
        </div>
      )}
    </div>
  );
}
