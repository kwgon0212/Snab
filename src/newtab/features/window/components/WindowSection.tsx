import { ChevronDown, Plus } from "lucide-react";
import BrowserUI from "@/newtab/components/ui/Browser";
import ResizeHandle from "@/newtab/components/ui/ResizeHandle";
import { useTranslation } from "react-i18next";

interface WindowSectionProps {
  allWindows: chrome.windows.Window[];
  sectionWidth: number;
  showScrollIndicator: boolean;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  onResize: (width: number) => void;
  onScroll: () => void;
  onScrollToBottom: () => void;
  onCreateWindow: () => void;
}

const WindowSection = ({
  allWindows,
  sectionWidth,
  showScrollIndicator,
  scrollRef,
  onResize,
  onScroll,
  onScrollToBottom,
  onCreateWindow,
}: WindowSectionProps) => {
  const { t } = useTranslation();

  return (
    <>
      <ResizeHandle
        onResize={onResize}
        strokeWidth={1}
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
        <h3 className="text-base text-gray-500 dark:text-slate-300">
          {t("windowSection.totalWindows", { count: allWindows.length })}
        </h3>
        <div className="flex items-center gap-2">
          <div className="h-1 w-4 rounded-full bg-blue-400" />
          <span className="text-gray-400 dark:text-slate-400">
            {t("windowSection.currentWindow")}
          </span>
          <div className="h-1 w-4 rounded-full bg-slate-300" />
          <span className="text-gray-400 dark:text-slate-400">
            {t("windowSection.otherWindows")}
          </span>
        </div>

        <div
          ref={scrollRef as React.RefObject<HTMLDivElement>}
          onScroll={onScroll}
          className="flex-1 overflow-y-auto flex flex-col gap-2 size-full pb-5 relative"
        >
          {allWindows.map((window, idx) => (
            <BrowserUI key={window.id} window={window} index={idx} />
          ))}
        </div>

        <button
          onClick={onCreateWindow}
          className="flex w-full justify-center items-center gap-2 bg-blue-500 hover:bg-blue-600 active:scale-95 px-4 py-2 transition-all duration-200 rounded-full text-white shadow-sm hover:shadow-md"
        >
          <Plus className="size-4" />
          <span>{t("windowSection.newWindow")}</span>
        </button>

        {showScrollIndicator && (
          <button
            onClick={onScrollToBottom}
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

export default WindowSection;
