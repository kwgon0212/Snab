interface Tab {
  id: string;
  originalId?: number;
  title: string;
  url: string;
  favIconUrl?: string;
  windowId: number;
}

interface Group {
  id: string;
  name: string;
  tabs: Tab[];
  createdAt: number;
}

interface Workspace {
  id: string;
  name: string;
  groups: Group[];
  createdAt: number;
}

// 새 워크스페이스 생성
const createWorkspace = async (name: string) => {
  try {
    const newWorkspace: Workspace = {
      id: `workspace-${Date.now()}`,
      name: name,
      groups: [],
      createdAt: Date.now(),
    };

    const result = await chrome.storage.local.get(["workspaces"]);
    const workspaces = result.workspaces || [];
    workspaces.push(newWorkspace);

    await chrome.storage.local.set({ workspaces });
    return newWorkspace;
  } catch (error) {
    console.error("워크스페이스 생성 실패:", error);
  }
};

// 워크스페이스 삭제
const deleteWorkspace = async (workspaceId: string) => {
  try {
    const result = await chrome.storage.local.get(["workspaces"]);
    const workspaces = result.workspaces || [];
    const filtered = workspaces.filter((w: Workspace) => w.id !== workspaceId);

    await chrome.storage.local.set({ workspaces: filtered });
    return true;
  } catch (error) {
    console.error("워크스페이스 삭제 실패:", error);
    return false;
  }
};

// 워크스페이스 저장
const saveWorkspace = async (workspace: Workspace) => {
  try {
    const result = await chrome.storage.local.get(["workspaces"]);
    const workspaces = result.workspaces || [];
    const updated = workspaces.map((w: Workspace) =>
      w.id === workspace.id ? workspace : w
    );

    if (!workspaces.some((w: Workspace) => w.id === workspace.id)) {
      updated.push(workspace);
    }

    await chrome.storage.local.set({ workspaces: updated });
  } catch (error) {
    console.error("워크스페이스 저장 실패:", error);
  }
};

// 워크스페이스 불러오기
const loadWorkspaces = async (): Promise<Workspace[]> => {
  try {
    const result = await chrome.storage.local.get(["workspaces"]);
    return result.workspaces || [];
  } catch (error) {
    console.error("워크스페이스 불러오기 실패:", error);
    return [];
  }
};

// 그룹 생성
const createGroup = async (workspaceId: string, groupName: string) => {
  try {
    const workspaces = await loadWorkspaces();
    const workspace = workspaces.find((w) => w.id === workspaceId);

    if (workspace) {
      const newGroup: Group = {
        id: `group-${Date.now()}`,
        name: groupName,
        tabs: [],
        createdAt: Date.now(),
      };

      workspace.groups.push(newGroup);
      await saveWorkspace(workspace);
      return newGroup;
    }
  } catch (error) {
    console.error("그룹 생성 실패:", error);
  }
};

// 탭을 그룹에 추가
const addTabToGroup = async (
  workspaceId: string,
  groupId: string,
  tab: Tab
) => {
  try {
    const workspaces = await loadWorkspaces();
    const workspace = workspaces.find((w) => w.id === workspaceId);

    if (workspace) {
      const group = workspace.groups.find((g) => g.id === groupId);
      if (group) {
        group.tabs.push(tab);
        await saveWorkspace(workspace);
      }
    }
  } catch (error) {
    console.error("탭 추가 실패:", error);
  }
};

// 그룹에서 탭 제거
const removeTabFromGroup = async (
  workspaceId: string,
  groupId: string,
  tabId: string
) => {
  try {
    const workspaces = await loadWorkspaces();
    const workspace = workspaces.find((w) => w.id === workspaceId);

    if (workspace) {
      const group = workspace.groups.find((g) => g.id === groupId);
      if (group) {
        group.tabs = group.tabs.filter((tab) => tab.id !== tabId);
        await saveWorkspace(workspace);
      }
    }
  } catch (error) {
    console.error("탭 제거 실패:", error);
  }
};

// 그룹 삭제
const deleteGroup = async (workspaceId: string, groupId: string) => {
  try {
    const workspaces = await loadWorkspaces();
    const workspace = workspaces.find((w) => w.id === workspaceId);

    if (workspace) {
      workspace.groups = workspace.groups.filter((g) => g.id !== groupId);
      await saveWorkspace(workspace);
      return true;
    }
    return false;
  } catch (error) {
    console.error("그룹 삭제 실패:", error);
    return false;
  }
};

// 그룹명 수정
const updateGroupName = async (
  workspaceId: string,
  groupId: string,
  newName: string
) => {
  try {
    const workspaces = await loadWorkspaces();
    const workspace = workspaces.find((w) => w.id === workspaceId);

    if (workspace) {
      const group = workspace.groups.find((g) => g.id === groupId);
      if (group) {
        group.name = newName;
        await saveWorkspace(workspace);
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error("그룹명 수정 실패:", error);
    return false;
  }
};

// 그룹 내 탭 순서 변경
const reorderGroupTabs = async (
  workspaceId: string,
  groupId: string,
  tabIds: string[]
) => {
  try {
    const workspaces = await loadWorkspaces();
    const workspace = workspaces.find((w) => w.id === workspaceId);

    if (workspace) {
      const group = workspace.groups.find((g) => g.id === groupId);
      if (group) {
        // 새로운 순서로 탭 배열 재정렬
        const reorderedTabs = tabIds
          .map((id) => group.tabs.find((tab) => tab.id === id))
          .filter(Boolean) as Tab[];

        // 기존 탭들 중 새로운 순서에 없는 것들 추가
        const remainingTabs = group.tabs.filter(
          (tab) => !tabIds.includes(tab.id)
        );

        group.tabs = [...reorderedTabs, ...remainingTabs];
        await saveWorkspace(workspace);
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error("탭 순서 변경 실패:", error);
    return false;
  }
};

// 그룹의 탭을 실제 윈도우에 복원
const restoreGroupTabs = async (groupId: string, workspaceId: string) => {
  try {
    const workspaces = await loadWorkspaces();
    const workspace = workspaces.find((w) => w.id === workspaceId);

    if (workspace) {
      const group = workspace.groups.find((g) => g.id === groupId);
      if (group && group.tabs.length > 0) {
        // 새 윈도우 생성
        const newWindow = await chrome.windows.create({});

        if (newWindow && newWindow.id) {
          // 첫 번째 탭을 새로 생성된 윈도우로 이동
          await chrome.tabs.create({
            windowId: newWindow.id,
            url: group.tabs[0].url,
          });

          // 나머지 탭들을 순차적으로 생성
          for (let i = 1; i < group.tabs.length; i++) {
            await chrome.tabs.create({
              windowId: newWindow.id,
              url: group.tabs[i].url,
            });
          }
        }
      }
    }
  } catch (error) {
    console.error("그룹 탭 복원 실패:", error);
  }
};

export {
  createWorkspace,
  deleteWorkspace,
  saveWorkspace,
  loadWorkspaces,
  createGroup,
  deleteGroup,
  updateGroupName,
  addTabToGroup,
  removeTabFromGroup,
  reorderGroupTabs,
  restoreGroupTabs,
};

export type { Workspace, Group, Tab };
