import { CollectionsRoot, FolderNode, TreeNode } from "@/types/collection";

const KEY = "collections";

export async function loadCollections(): Promise<CollectionsRoot> {
  const raw = (await chrome.storage.local.get(KEY))[KEY];
  if (raw) return raw;
  // 최초 초기화
  const now = Date.now();
  const root = {
    version: 1,
    root: {
      id: "root",
      name: "내 컬렉션",
      type: "folder",
      children: [],
      createdAt: now,
      updatedAt: now,
      expanded: true,
    },
  } as CollectionsRoot;
  await chrome.storage.local.set({ [KEY]: root });
  return root;
}

export async function saveCollections(cs: CollectionsRoot) {
  cs.root.updatedAt = Date.now();
  await chrome.storage.local.set({ [KEY]: cs });
}

// 유틸
export const nano = () => crypto.randomUUID();

export function findNode(
  root: FolderNode,
  id: string
): { parent?: FolderNode; node?: TreeNode } {
  if (root.id === id) return { node: root };
  const stack: { parent: FolderNode; node: TreeNode }[] = root.children.map(
    (n) => ({ parent: root, node: n })
  );
  while (stack.length) {
    const cur = stack.pop()!;
    if (cur.node.id === id) return cur;
    if (cur.node.type === "folder") {
      cur.node.children.forEach((n) =>
        stack.push({ parent: cur.node as FolderNode, node: n })
      );
    }
  }
  return {};
}
