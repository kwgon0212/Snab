export interface Workspace {
  id: string;
  name: string;
  createdAt: string;
  groups: WorkspaceGroup[];
  groupViewMode?: 1 | 2;
  tabViewMode?: 1 | 2 | 3;
}

export interface WorkspaceGroup {
  id: string;
  name: string;
  tabs: chrome.tabs.Tab[];
}
