import { ChevronDown, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import BrowserUI from "../../ui/Browser";
import ResizeHandle from "../../ui/ResizeHandle";

const Window = ({ allWindows }: { allWindows: chrome.windows.Window[] }) => {
  const [sectionWidth, setSectionWidth] = useState(400);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
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

  const handleCreateWindow = async () => {
    await chrome.windows.create({});
  };

  return (
    <>
      <ResizeHandle
        onResize={setSectionWidth}
        strokeWidth={2}
        minWidth={280}
        maxWidth={400}
        direction="horizontal"
        initialWidth={sectionWidth}
        resizeTarget="right"
      />

      <section
        className="p-4 size-full flex flex-col gap-2 relative"
        style={{ width: `${sectionWidth}px` }}
      >
        <h3 className="text-sm text-slate-600">
          총 {allWindows.length}개의 윈도우
        </h3>
        <div className="flex items-center gap-2">
          <div className="h-1 w-4 bg-blue-400" />
          <span className="text-slate-500">현재 윈도우</span>
          <div className="h-1 w-4 bg-slate-300" />
          <span className="text-slate-500">나머지 윈도우</span>
        </div>

        <div
          ref={scrollRef}
          onScroll={checkScrollable}
          className="flex-1 overflow-y-auto flex flex-col gap-2 size-full pb-5 relative"
        >
          {allWindows.map((window, idx) => (
            <BrowserUI key={window.id} window={window} index={idx} />
          ))}
        </div>

        <button
          onClick={handleCreateWindow}
          className="flex w-full justify-center items-center gap-2 bg-blue-500 hover:bg-blue-600 active:scale-95 px-4 py-2 transition-all duration-200 rounded-full text-white shadow-sm hover:shadow-md"
        >
          <Plus className="size-4" />
          <span>새 윈도우</span>
        </button>

        {showScrollIndicator && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-14 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center justify-center"
            title="아래로 스크롤"
          >
            <ChevronDown className="size-8 text-slate-600 animate-bounce" />
          </button>
        )}
      </section>
    </>
  );
};

export default Window;
