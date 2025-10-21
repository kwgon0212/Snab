// src/types/collection.ts
export type NodeBase = {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
};

export type FolderNode = NodeBase & {
  type: "folder";
  children: TreeNode[];
  expanded?: boolean;
};

export type SessionLeaf = NodeBase & {
  type: "session"; // = 파일
  sessionId: string; // 기존 세션 스냅샷 id (restore용)
  meta?: { tabs: number; windows: number };
};

export type TreeNode = FolderNode | SessionLeaf;

export type CollectionsRoot = {
  version: 1;
  root: FolderNode; // 항상 존재
};
