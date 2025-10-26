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

export const addTabToSession = async (sessionId: string, url: string) => {
  try {
    // snapshots에서 해당 세션 찾기
    const result = await chrome.storage.local.get("snapshots");
    const snapshots = result.snapshots || [];
    const snapshotIndex = snapshots.findIndex(
      (s: any) => s.id === parseInt(sessionId)
    );

    if (snapshotIndex === -1) {
      throw new Error("세션을 찾을 수 없습니다.");
    }

    // 새 탭 정보 생성
    const newTab = {
      id: Date.now(), // 임시 ID
      url: url,
      title: "", // 나중에 업데이트됨
      faviconUrl: `https://www.google.com/s2/favicons?domain=${
        new URL(url).hostname
      }`,
      active: false,
      pinned: false,
      windowId: 0,
      index: snapshots[snapshotIndex].tabs.length,
    };

    // 탭을 세션에 추가
    snapshots[snapshotIndex].tabs.push(newTab);
    snapshots[snapshotIndex].updatedAt = Date.now();

    // 저장
    await chrome.storage.local.set({ snapshots });

    return newTab;
  } catch (error) {
    console.error("탭 생성 실패:", error);
    throw error;
  }
};
