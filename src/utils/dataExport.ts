interface ExportData {
  workspaces: any[];
  bookmarks: any[];
  snapshotCloseWindows: boolean;
  exportDate: string;
  version: string;
}

// 모든 데이터를 JSON으로 추출
export const exportAllData = async (): Promise<string> => {
  try {
    const result = await chrome.storage.local.get([
      "workspaces",
      "bookmarks",
      "snapshotCloseWindows",
    ]);

    const exportData: ExportData = {
      workspaces: result.workspaces || [],
      bookmarks: result.bookmarks || [],
      snapshotCloseWindows: result.snapshotCloseWindows || false,
      exportDate: new Date().toISOString(),
      version: "1.0",
    };

    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    console.error("데이터 추출 실패:", error);
    throw error;
  }
};

// JSON 파일을 다운로드
export const downloadDataAsJSON = async () => {
  try {
    const jsonData = await exportAllData();
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `snab-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("파일 다운로드 실패:", error);
    throw error;
  }
};

// JSON 파일에서 데이터 복원 (기존 데이터에 추가)
export const importDataFromJSON = async (jsonFile: File): Promise<boolean> => {
  try {
    const text = await jsonFile.text();
    const importData: ExportData = JSON.parse(text);

    // 데이터 검증
    if (!importData.version || !importData.exportDate) {
      throw new Error("유효하지 않은 백업 파일입니다.");
    }

    // 기존 데이터 가져오기
    const currentData = await chrome.storage.local.get([
      "workspaces",
      "bookmarks",
      "snapshotCloseWindows",
    ]);

    const currentWorkspaces = currentData.workspaces || [];
    const currentBookmarks = currentData.bookmarks || [];

    // 워크스페이스 ID 충돌 방지를 위해 새로운 ID 생성
    const importedWorkspaces = (importData.workspaces || []).map(
      (workspace: any) => ({
        ...workspace,
        id: `imported-${Date.now()}-${workspace.id}`,
        name: `${workspace.name} (가져온 데이터)`,
        groups: workspace.groups.map((group: any) => ({
          ...group,
          id: `imported-${Date.now()}-${group.id}`,
        })),
      })
    );

    // 북마크 중복 제거 (URL 기준)
    const existingUrls = new Set(
      currentBookmarks.map((bookmark: any) => bookmark.url)
    );
    const newBookmarks = (importData.bookmarks || []).filter(
      (bookmark: any) => !existingUrls.has(bookmark.url)
    );

    // 데이터 병합
    await chrome.storage.local.set({
      workspaces: [...currentWorkspaces, ...importedWorkspaces],
      bookmarks: [...currentBookmarks, ...newBookmarks],
      // 스냅샷 옵션은 기존 설정 유지
    });

    return true;
  } catch (error) {
    console.error("데이터 복원 실패:", error);
    throw error;
  }
};

// 파일 선택 다이얼로그 열기
export const selectAndImportJSON = (): Promise<File | null> => {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      resolve(file || null);
    };
    input.click();
  });
};
