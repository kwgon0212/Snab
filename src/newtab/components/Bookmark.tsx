import { useState, useEffect } from "react";
import { Trash2, ChevronDown } from "lucide-react";
import {
  loadBookmarks,
  removeBookmark,
  type BookmarkData,
} from "@/store/bookmark";
import Link from "./Link";
import { cn } from "@/utils/cn";

const Bookmark = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);

  // 북마크 불러오기
  const loadBookmarkData = async () => {
    try {
      setIsLoading(true);
      const bookmarkData = await loadBookmarks();
      setBookmarks(bookmarkData);
    } catch (error) {
      console.error("북마크 불러오기 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 북마크 제거
  const handleRemoveBookmark = async (url: string) => {
    try {
      await removeBookmark(url);
      setBookmarks((prev) => prev.filter((bookmark) => bookmark.url !== url));
    } catch (error) {
      console.error("북마크 제거 실패:", error);
    }
  };

  // 북마크 클릭 시 새 탭에서 열기
  const handleBookmarkClick = (url: string) => {
    chrome.tabs.create({ url });
  };

  useEffect(() => {
    loadBookmarkData();

    // 북마크 변경 이벤트 리스너 추가
    const handleStorageChange = (changes: {
      [key: string]: chrome.storage.StorageChange;
    }) => {
      if (changes.bookmarks) {
        loadBookmarkData();
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  if (bookmarks.length === 0) return null;

  return (
    <div className="bg-slate-100 border-b border-slate-200 overflow-hidden">
      {/* 헤더 */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-slate-50 transition-colors"
      >
        <h3 className="text-sm font-semibold text-slate-600">
          북마크 ({bookmarks.length})
        </h3>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-slate-400 transition-transform duration-300",
            isExpanded ? "rotate-180" : ""
          )}
        />
      </div>

      {/* 컨텐츠 */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="flex flex-wrap gap-2 p-2">
          {bookmarks.map((bookmark) => (
            <Link
              key={bookmark.url}
              id={bookmark.url
                .split("")
                .reduce((a, b) => a + b.charCodeAt(0), 0)}
              onClick={() => handleBookmarkClick(bookmark.url)}
              className="flex items-center gap-2 bg-white hover:shadow-sm hover:pr-10 px-4 py-2 transition-all duration-500 rounded-md relative group cursor-pointer"
            >
              {bookmark.faviconUrl ? (
                <img
                  src={bookmark.faviconUrl}
                  alt={bookmark.title}
                  className="size-4 rounded-sm"
                  style={{
                    filter:
                      "drop-shadow(0 0 0.1px rgba(0,0,0,0.6)) drop-shadow(0 0 1px rgba(0,0,0,0.35))",
                  }}
                />
              ) : (
                <div className="size-4 rounded-sm flex items-center justify-center">
                  <span className="text-sm">🌐</span>
                </div>
              )}
              <span className="text-sm truncate">{bookmark.title}</span>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveBookmark(bookmark.url);
                }}
              >
                <Trash2 className="size-4 text-red-500 hover:text-red-700 hover:scale-120 transition-all duration-500" />
              </button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Bookmark;
