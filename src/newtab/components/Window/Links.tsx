import { ChevronRight, Clock3 } from "lucide-react";
import { formatTime } from "../../../utils/formatTime";
import { useEffect, useRef } from "react";
import CloseTab from "./CloseTab";

const Links = ({ tabs }: { tabs: chrome.tabs.Tab[] }) => {
  const scrollRef = useRef<HTMLLIElement>(null);
  const prevTabsLength = useRef(tabs.length);

  useEffect(() => {
    // 탭이 추가되었을 때만 스크롤
    if (tabs.length > prevTabsLength.current && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    prevTabsLength.current = tabs.length;
  }, [tabs.length]);

  if (tabs.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        <p>탭이 없습니다</p>
      </div>
    );
  }

  return (
    <li
      className="w-full min-w-0 grid gap-2 max-h-[500px] overflow-y-auto"
      ref={scrollRef}
    >
      {tabs.map((tab) => (
        <a
          href={tab.url}
          key={tab.id}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full min-w-0 group flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 bg-white relative"
        >
          <div className="flex-shrink-0 w-5 h-5">
            {tab.favIconUrl ? (
              <img
                src={tab.favIconUrl}
                alt=""
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="w-full h-full bg-slate-200 rounded flex items-center justify-center text-xs text-slate-500">
                🌐
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-slate-800 truncate group-hover:text-blue-600 transition-colors">
              {tab.title || "제목 없음"}
            </h4>
            <div className="flex gap-1 items-center">
              <div className="flex items-center gap-1 text-slate-400 shrink-0">
                <Clock3 className="size-3" />
                <span>
                  {tab.lastAccessed
                    ? formatTime(tab.lastAccessed)
                    : "알 수 없음"}
                </span>
              </div>
              <span>·</span>
              <p className="text-xs text-slate-500 truncate">{tab.url}</p>
            </div>
          </div>

          {/* Badges */}
          {/* <div className="flex items-center gap-1 flex-shrink-0">
            {tab.pinned && (
              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                📌
              </span>
            )}
            {tab.active && (
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                활성
              </span>
            )}
            {tab.audible && (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                🔊
              </span>
            )}
          </div> */}

          {tab.id && (
            <CloseTab
              tabId={tab.id}
              className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:bg-blue-100 hover:bg-blue-200 group-hover:text-blue-600 rounded-full p-1"
            />
          )}
        </a>
      ))}
    </li>
  );
};

export default Links;
