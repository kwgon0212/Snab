import { useState, useEffect, useCallback } from "react";
import type { Workspace } from "@/store/workspace";

interface UseSnapshotProps {
  allWindows: chrome.windows.Window[];
  fetchWindows: () => void;
}

export const useSnapshot = ({ allWindows, fetchWindows }: UseSnapshotProps) => {
  const [closeWindowsAfterSnapshot, setCloseWindowsAfterSnapshot] =
    useState(false);

  // 스냅샷 옵션 불러오기
  useEffect(() => {
    const loadSnapshotOption = async () => {
      try {
        const { loadSnapshotOption } = await import("@/store/workspace");
        const option = await loadSnapshotOption();
        setCloseWindowsAfterSnapshot(option);
      } catch (error) {
        console.error("스냅샷 옵션 불러오기 실패:", error);
      }
    };
    loadSnapshotOption();
  }, []);

  const handleSnapshot = useCallback(async () => {
    try {
      // 새 워크스페이스 생성
      const { createWorkspace, createGroup, addTabToGroup } = await import(
        "@/store/workspace"
      );

      // 날짜 기반 워크스페이스 이름
      const workspaceName = new Date().toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });

      const newWorkspace = await createWorkspace(workspaceName);

      if (!newWorkspace) {
        alert("스냅샷 저장에 실패했습니다.");
        return;
      }

      // 각 윈도우를 그룹으로 변환
      for (const window of allWindows) {
        if (!window.tabs || window.tabs.length === 0) continue;

        const groupName = `Window ${window.id}`;
        const newGroup = await createGroup(newWorkspace.id, groupName);

        if (!newGroup) continue;

        // 윈도우의 탭들을 그룹에 추가
        for (const tab of window.tabs) {
          if (!tab.url) continue;

          const tabData = {
            id: `snapshot-${Date.now()}-${Math.random()
              .toString(36)
              .substr(2, 9)}`,
            originalId: tab.id,
            title: tab.title || "",
            url: tab.url,
            favIconUrl: tab.favIconUrl,
            windowId: window.id || 0,
          };

          await addTabToGroup(newWorkspace.id, newGroup.id, tabData);
        }
      }

      // 워크스페이스 업데이트 이벤트 발생
      window.dispatchEvent(new CustomEvent("workspace-updated"));

      // 윈도우 닫기 옵션이 꺼져있으면 모든 윈도우 닫기 (스위치가 OFF일 때 닫기)
      if (!closeWindowsAfterSnapshot) {
        const closePromises = allWindows
          .map((w) => w.id)
          .filter((id): id is number => id !== undefined)
          .map((id) => chrome.windows.remove(id));

        await Promise.all(closePromises);
        fetchWindows();
      }

      alert("스냅샷이 저장되었습니다.");
    } catch (error) {
      console.error("스냅샷 저장 실패:", error);
      alert("스냅샷 저장에 실패했습니다.");
    }
  }, [allWindows, closeWindowsAfterSnapshot, fetchWindows]);

  const handleToggleCloseWindows = useCallback(async () => {
    const newValue = !closeWindowsAfterSnapshot;
    setCloseWindowsAfterSnapshot(newValue);

    // 스토리지에 저장
    try {
      const { saveSnapshotOption } = await import("@/store/workspace");
      await saveSnapshotOption(newValue);
    } catch (error) {
      console.error("스냅샷 옵션 저장 실패:", error);
    }
  }, [closeWindowsAfterSnapshot]);

  return {
    closeWindowsAfterSnapshot,
    handleSnapshot,
    handleToggleCloseWindows,
  };
};
