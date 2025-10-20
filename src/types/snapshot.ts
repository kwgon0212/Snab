export interface TabSnapshot {
  url: string;
  title: string;
  faviconUrl: string;
}

export interface WindowSnapshot {
  id: number;
  name: string;
  createdAt: number;
  tabs: TabSnapshot[];
}
