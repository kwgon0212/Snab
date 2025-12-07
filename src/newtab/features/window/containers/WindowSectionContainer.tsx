import { useEffect, useRef, useState } from "react";
import WindowSection from "../components/WindowSection";

interface WindowSectionContainerProps {
  allWindows: chrome.windows.Window[];
}

const WindowSectionContainer = ({ allWindows }: WindowSectionContainerProps) => {
  const [sectionWidth, setSectionWidth] = useState(400);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
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
  }, [allWindows]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const handleCreateWindow = async () => {
    await chrome.windows.create({});
  };

  return (
    <WindowSection
      allWindows={allWindows}
      sectionWidth={sectionWidth}
      showScrollIndicator={showScrollIndicator}
      scrollRef={scrollRef}
      onResize={setSectionWidth}
      onScroll={checkScrollable}
      onScrollToBottom={scrollToBottom}
      onCreateWindow={handleCreateWindow}
    />
  );
};

export default WindowSectionContainer;
