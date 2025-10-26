interface BookmarkData {
  url: string;
  title: string;
  faviconUrl: string;
}

// 북마크 저장
const saveBookmark = async (bookmark: BookmarkData) => {
  try {
    const result = await chrome.storage.local.get(["bookmarks"]);
    const bookmarks = result.bookmarks || [];
    bookmarks.push(bookmark);
    await chrome.storage.local.set({ bookmarks });
  } catch (error) {
    console.error("북마크 저장 실패:", error);
  }
};

// 북마크 불러오기
const loadBookmarks = async () => {
  try {
    const result = await chrome.storage.local.get(["bookmarks"]);
    return result.bookmarks || [];
  } catch (error) {
    console.error("북마크 불러오기 실패:", error);
  }
};

// 북마크 제거
const removeBookmark = async (url: string) => {
  try {
    const result = await chrome.storage.local.get(["bookmarks"]);
    const bookmarks = result.bookmarks || [];
    const filteredBookmarks = bookmarks.filter(
      (bookmark: BookmarkData) => bookmark.url !== url
    );
    await chrome.storage.local.set({ bookmarks: filteredBookmarks });
  } catch (error) {
    console.error("북마크 제거 실패:", error);
  }
};

// 북마크 상태 확인
const isBookmarked = async (url: string) => {
  try {
    const bookmarks = await loadBookmarks();
    return bookmarks.some((bookmark: BookmarkData) => bookmark.url === url);
  } catch (error) {
    console.error("북마크 상태 확인 실패:", error);
    return false;
  }
};

// 북마크 토글
const toggleBookmark = async (bookmark: BookmarkData) => {
  try {
    const isBooked = await isBookmarked(bookmark.url);
    if (isBooked) {
      await removeBookmark(bookmark.url);
      return false; // 북마크 제거됨
    } else {
      await saveBookmark(bookmark);
      return true; // 북마크 추가됨
    }
  } catch (error) {
    console.error("북마크 토글 실패:", error);
    return false;
  }
};

export {
  saveBookmark,
  loadBookmarks,
  removeBookmark,
  isBookmarked,
  toggleBookmark,
};
export type { BookmarkData };
