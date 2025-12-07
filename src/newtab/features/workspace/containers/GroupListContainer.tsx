import { useEffect, useRef, useState } from "react";
import { useWorkspaceStore } from "@/newtab/store/workspace";
import GroupList from "../components/GroupList";

const GroupListContainer = ({
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
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;

      setShowScrollIndicator(hasMoreContent && !isAtBottom);
    }
  };

  useEffect(() => {
    checkScrollable();
    window.addEventListener("resize", checkScrollable);
    return () => window.removeEventListener("resize", checkScrollable);
  }, [groups]); // Re-check when groups change

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
    <GroupList
      groups={groups}
      groupViewMode={groupViewMode}
      tabViewMode={tabViewMode}
      scrollRef={scrollRef}
      showScrollIndicator={showScrollIndicator}
      onScroll={checkScrollable}
      onScrollToBottom={scrollToBottom}
    />
  );
};

export default GroupListContainer;
