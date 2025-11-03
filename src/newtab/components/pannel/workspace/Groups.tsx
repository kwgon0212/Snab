import { useEffect, useRef, useState } from "react";
import GroupCard from "./GroupCard";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";
import { useWorkspaceStore } from "@/newtab/store/workspace";

const Groups = ({
  groupViewMode,
  tabViewMode,
}: {
  groupViewMode: 1 | 2;
  tabViewMode: 1 | 2 | 3;
}) => {
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const { activeWorkspace } = useWorkspaceStore();
  const groups = activeWorkspace?.groups || [];
  const scrollRef = useRef<HTMLDivElement>(null);

  const checkScrollable = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const hasMoreContent = scrollHeight > clientHeight;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px 여유

      setShowScrollIndicator(hasMoreContent && !isAtBottom);
    }
  };

  useEffect(() => {
    checkScrollable();
    window.addEventListener("resize", checkScrollable);
    return () => window.removeEventListener("resize", checkScrollable);
  }, []);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  if (!activeWorkspace) return null;

  return (
    <>
      <div
        className="size-full overflow-y-auto"
        ref={scrollRef}
        onScroll={checkScrollable}
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
              <p className="text-sm text-slate-500">
                {activeWorkspace.name}에 그룹이 없습니다.
              </p>
              <p className="text-xs text-slate-400">
                새로운 그룹을 생성해주세요.
              </p>
            </div>
          )}

          {groups.map((group) => (
            <GroupCard
              key={`group-${group.id}`}
              group={group}
              tabViewMode={tabViewMode}
            />
          ))}
        </div>
      </div>
      {showScrollIndicator && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center justify-center"
          title="아래로 스크롤"
        >
          <ChevronDown className="size-8 text-slate-600 animate-bounce" />
        </button>
      )}
    </>
  );
};

export default Groups;
