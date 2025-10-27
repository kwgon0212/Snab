import type { Tab } from "@/store/workspace";

interface TabItemProps {
  tab: Tab;
  onTabClick: (tab: Tab) => void;
  onDelete: () => void;
}

export const TabItem = ({ tab, onTabClick, onDelete }: TabItemProps) => {
  return (
    <div className="flex items-center gap-2 truncate">
      {tab.favIconUrl ? (
        <img
          src={tab.favIconUrl}
          alt=""
          className="size-4 rounded-sm flex-shrink-0"
          style={{
            filter:
              "drop-shadow(0 0 0.1px rgba(0,0,0,0.6)) drop-shadow(0 0 1px rgba(0,0,0,0.35))",
          }}
        />
      ) : (
        <div className="size-4 rounded-sm bg-slate-200 flex items-center justify-center flex-shrink-0">
          <span className="text-xs">🌐</span>
        </div>
      )}
      <span className="text-sm truncate flex-1 min-w-0">{tab.title}</span>
    </div>
  );
};
