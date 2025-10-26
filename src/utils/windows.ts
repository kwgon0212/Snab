export const loadAllWindows = async () => {
  // 현재 탭 정보 가져오기
  const [currentTab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  const windows = await chrome.windows.getAll({ populate: true });
  return windows;

  // const filteredWindows = windows.map((window) => ({
  //   ...window,
  //   tabs:
  //     window.tabs?.filter((tab) => {
  //       const url = tab.url || "";
  //       const isCurrentTab = tab.id === currentTab?.id;
  //       const isChromeUrl =
  //         url.startsWith("chrome://") || url.startsWith("chrome-extension://");

  //       return !isCurrentTab && !isChromeUrl;
  //     }) || [],
  // }));
  // return filteredWindows;
};

export const loadCurrentWindow = async () => {
  const tabs = await chrome.tabs.query({ currentWindow: true });
  console.log(tabs);
  return tabs;
};

export const createWindow = async () => {
  await chrome.windows.create({
    focused: true,
    type: "normal",
  });
};

export const closeWindow = async (windowId: number) => {
  await chrome.windows.remove(windowId);
};

export const minimizeWindow = async (windowId: number) => {
  await chrome.windows.update(windowId, { state: "minimized" });
};

export const fullscreenWindow = async (windowId: number) => {
  await chrome.windows.update(windowId, { state: "fullscreen" });
};
