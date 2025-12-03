import { create } from "zustand";
import type { Workspace } from "@/newtab/types/workspace";

interface WorkspaceStore {
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  setWorkspaces: (workspaces: Workspace[]) => void;
  setActiveWorkspace: (workspace: Workspace | null) => void;
  addWorkspace: (workspace: Workspace) => void;
  updateWorkspace: (id: string, updates: Partial<Workspace>) => void;
  deleteWorkspace: (id: string) => void;
  loadWorkspaces: () => Promise<void>;
}

export const useWorkspaceStore = create<WorkspaceStore>((set, get) => ({
  workspaces: [],
  activeWorkspace: null,

  setWorkspaces: (workspaces) => set({ workspaces }),

  setActiveWorkspace: (activeWorkspace) => set({ activeWorkspace }),

  addWorkspace: (workspace) => {
    const { workspaces } = get();
    const newWorkspaces = [...workspaces, workspace];
    set({
      workspaces: newWorkspaces,
      activeWorkspace: workspace,
    });

    // chrome.storage에 저장
    chrome.storage.local.set({ workspaces: newWorkspaces });
  },

  updateWorkspace: (id, updates) => {
    const { workspaces, activeWorkspace } = get();
    const newWorkspaces = workspaces.map((workspace) =>
      workspace.id === id ? { ...workspace, ...updates } : workspace
    );
    const updatedActiveWorkspace =
      activeWorkspace?.id === id
        ? { ...activeWorkspace, ...updates }
        : activeWorkspace;

    set({
      workspaces: newWorkspaces,
      activeWorkspace: updatedActiveWorkspace,
    });

    // chrome.storage에 저장
    chrome.storage.local.set({ workspaces: newWorkspaces });
  },

  deleteWorkspace: (id) => {
    const { workspaces } = get();

    if (workspaces.length === 1) {
      alert("최소 1개의 워크스페이스는 유지되어야 합니다.");
      return;
    }

    const workspaceName = workspaces.find(
      (workspace) => workspace.id === id
    )?.name;
    const result = confirm(
      `[${workspaceName}] 워크스페이스를 삭제하시겠습니까?`
    );
    if (!result) return;

    const newWorkspaces = workspaces.filter((workspace) => workspace.id !== id);
    // 삭제 후 항상 첫 번째 워크스페이스로 이동
    const newActiveWorkspace = newWorkspaces[0] || null;

    set({
      workspaces: newWorkspaces,
      activeWorkspace: newActiveWorkspace,
    });

    // chrome.storage에 저장
    chrome.storage.local.set({ workspaces: newWorkspaces });
  },

  loadWorkspaces: async () => {
    try {
      const storage = await chrome.storage.local.get("workspaces");
      let workspacesData = storage.workspaces || [];

      if (workspacesData.length === 0) {
        const defaultWorkspace: Workspace = {
          id: crypto.randomUUID(),
          name: "나의 워크스페이스",
          createdAt: new Date().toISOString(),
          groups: [],
          groupViewMode: 1,
          tabViewMode: 1,
        };
        workspacesData = [defaultWorkspace];
        await chrome.storage.local.set({ workspaces: workspacesData });
      }

      set({
        workspaces: workspacesData,
        activeWorkspace: workspacesData[0],
      });
    } catch (error) {
      console.error("워크스페이스 로드 실패:", error);
    }
  },
}));
