// Collections 메인 컴포넌트 - VSCode 스타일 레이아웃
import React from "react";
import type {
  CollectionsRoot,
  TreeNode,
  FolderNode,
  SessionLeaf,
} from "@/types/collection";
import {
  loadCollections,
  saveCollections,
  findNode,
  nano,
} from "@/store/collections";
import { cn } from "@/utils/cn";
import TreeFolder from "./TreeFolder";
import SessionContent from "./SessionContent";

export default function Collections({
  onOpenSession,
}: {
  onOpenSession: (sessionId: string) => void;
}) {
  const [data, setData] = React.useState<CollectionsRoot | null>(null);
  const [selected, setSelected] = React.useState<string | null>(null);
  const [renaming, setRenaming] = React.useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [sidebarWidth, setSidebarWidth] = React.useState(250);
  const [isResizing, setIsResizing] = React.useState(false);

  React.useEffect(() => {
    loadCollections().then(setData);
  }, []);

  const commit = async (next: CollectionsRoot) => {
    setData(next);
    await saveCollections(next);
  };

  // 리사이즈 핸들러
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = Math.max(150, Math.min(500, e.clientX));
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing]);

  if (!data)
    return <div className="p-3 text-sm text-gray-500">불러오는중…</div>;

  // CRUD 함수들
  const newFolder = async (parentId: string) => {
    const root = structuredClone(data);
    const { node } = findNode(root.root, parentId);
    if (!node || node.type !== "folder") return;

    // 부모 폴더가 닫혀있으면 열기
    if (!node.expanded) {
      node.expanded = true;
    }

    const id = nano();
    node.children.unshift({
      id,
      type: "folder",
      name: new Date().toLocaleDateString(),
      children: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      expanded: true,
    } as FolderNode);
    await commit(root);
    setSelected(id);
    setRenaming(id);
  };

  const newSession = async (
    parentId: string,
    sessionId: string,
    meta?: SessionLeaf["meta"]
  ) => {
    const root = structuredClone(data);
    const { node } = findNode(root.root, parentId);
    if (!node || node.type !== "folder") return;

    // 부모 폴더가 닫혀있으면 열기
    if (!node.expanded) {
      node.expanded = true;
    }

    const id = nano();
    node.children.unshift({
      id,
      type: "session",
      name: new Date().getTime() + " - 세션",
      sessionId,
      meta,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    } as SessionLeaf);
    await commit(root);
    setSelected(id);
    setRenaming(id);
  };

  const rename = async (id: string, name: string) => {
    const root = structuredClone(data);
    const f = findNode(root.root, id);
    if (!f.node) return;
    f.node.name = name || f.node.name;
    await commit(root);
  };

  const remove = async (id: string) => {
    if (!confirm("삭제할까요?")) return;
    const root = structuredClone(data);
    const f = findNode(root.root, id);
    if (!f.node || !f.parent) return;
    f.parent.children = f.parent.children.filter((n) => n.id !== id);
    await commit(root);
    setSelected(f.parent.id);
  };

  const toggle = async (id: string) => {
    const root = structuredClone(data);
    const f = findNode(root.root, id);
    if (f.node?.type === "folder") {
      f.node.expanded = !f.node.expanded;
      await commit(root);
      setSelected(id);
    }
  };

  // DnD
  const onDragStart = (e: React.DragEvent, node: TreeNode) => {
    e.dataTransfer.setData("text/plain", node.id);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDrop = async (e: React.DragEvent, dest: FolderNode) => {
    e.preventDefault();
    const srcId = e.dataTransfer.getData("text/plain");
    if (!srcId || srcId === dest.id) return;
    const root = structuredClone(data);
    const s = findNode(root.root, srcId);
    if (!s.node || !s.parent) return;

    // 폴더를 자신의 하위로 이동 금지
    if (s.node.type === "folder") {
      const checkLoop = findNode(s.node, dest.id);
      if (checkLoop.node) return;
    }

    // 이동
    s.parent.children = s.parent.children.filter((n) => n.id !== srcId);
    dest.children.unshift(s.node);
    dest.updatedAt = Date.now();
    await commit(root);
    setSelected(s.node.id);
  };

  // 선택된 세션의 데이터 가져오기
  const getSelectedSessionData = () => {
    if (!selected) return null;
    const { node } = findNode(data.root, selected);
    if (node && node.type === "session") {
      return node as SessionLeaf;
    }
    return null;
  };

  const selectedSession = getSelectedSessionData();

  return (
    <div className="h-full flex overflow-hidden relative">
      {/* 탐색기 (리사이즈 가능) */}
      <aside className="relative flex-shrink-0">
        <div
          className={cn(
            "h-full border-r border-gray-200 overflow-hidden transition-all",
            isResizing ? "duration-0" : "duration-300 ease-in-out"
          )}
          style={{ width: isSidebarOpen ? `${sidebarWidth}px` : "0px" }}
        >
          <div className="h-full overflow-y-auto px-2 py-4 text-sm select-none">
            <TreeFolder
              node={data.root}
              depth={0}
              selected={selected}
              renaming={renaming}
              setSelected={setSelected}
              setRenaming={setRenaming}
              onToggle={toggle}
              onRename={rename}
              onRemove={remove}
              onNewFolder={newFolder}
              onNewSession={newSession}
              onOpenSession={onOpenSession}
              onDragStart={onDragStart}
              onDropFolder={onDrop}
            />
          </div>
        </div>

        {/* 리사이즈 핸들 */}
        {isSidebarOpen && (
          <div
            className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-400 transition-colors group"
            onMouseDown={() => setIsResizing(true)}
          >
            <div className="absolute inset-0 w-2 -left-0.5" />
          </div>
        )}

        {/* 토글 버튼 */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 -right-6 w-6 h-12 bg-white border border-l-0 border-gray-300 hover:bg-gray-100 hover:border-blue-400 transition-all duration-300 flex items-center justify-center shadow-md rounded-r-lg"
          )}
          title={isSidebarOpen ? "탐색기 닫기" : "탐색기 열기"}
        >
          <svg
            className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${
              isSidebarOpen ? "" : "rotate-180"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </aside>

      {/* 컨텐츠 영역 (오른쪽 80%) */}
      <main className="flex-1 overflow-auto p-6">
        {selectedSession ? (
          <SessionContent
            session={selectedSession}
            onOpenSession={onOpenSession}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
              <p className="text-lg">세션을 선택하세요</p>
              <p className="text-sm mt-2">
                왼쪽 탐색기에서 파일을 선택하면 저장된 탭들이 표시됩니다
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
