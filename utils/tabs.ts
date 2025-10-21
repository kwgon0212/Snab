export const addTabToWindow = async (windowId: number, url: string) => {
  try {
    const tab = await chrome.tabs.create({
      windowId: windowId,
      url: url,
      active: false, // 새 탭을 활성화하지 않음
    });
    return tab;
  } catch (error) {
    console.error("탭 생성 실패:", error);
  }
};
