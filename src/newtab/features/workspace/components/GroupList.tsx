import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";
import { WorkspaceGroup } from "@/newtab/types/workspace";
import GroupCardContainer from "../containers/GroupCardContainer"; // Using container here as list items need logic
import { useTranslation } from "react-i18next";

interface GroupListProps {
  groups: WorkspaceGroup[];
  groupViewMode: 1 | 2;
  tabViewMode: 1 | 2 | 3;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  showScrollIndicator: boolean;
  onScroll: () => void;
  onScrollToBottom: () => void;
}

const GroupList = ({
  groups,
  groupViewMode,
  tabViewMode,
  scrollRef,
  showScrollIndicator,
  onScroll,
  onScrollToBottom,
}: GroupListProps) => {
  const { t } = useTranslation();
  return (
    <>
      <div
        className="size-full overflow-y-auto"
        ref={scrollRef as React.RefObject<HTMLDivElement>}
        onScroll={onScroll}
      >
        <div
          className={cn(
            "space-y-4 transition-all duration-200",
            groupViewMode === 1 && "columns-1",
            groupViewMode === 2 && "columns-2",
            groups.length === 0 && "columns-1"
          )}
        >
          {groups.length === 0 && (
            <div className="flex flex-col gap-2 items-center justify-center pt-10">
              <p className="text-sm text-gray-500 dark:text-slate-300">
                {t("content.noGroups")}
              </p>
              <p className="text-xs text-gray-400 dark:text-slate-400">
                {t("content.createGroupHint", "새로운 그룹을 생성해주세요.")}
              </p>
            </div>
          )}

          {groups.map((group) => (
            <GroupCardContainer
              key={`group-${group.id}`}
              group={group}
              tabViewMode={tabViewMode}
            />
          ))}
        </div>
      </div>
      {showScrollIndicator && (
        <button
          onClick={onScrollToBottom}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center justify-center"
          title="아래로 스크롤"
        >
          <ChevronDown className="size-8 text-slate-600 animate-bounce" />
        </button>
      )}
    </>
  );
};

export default GroupList;
