import { Camera } from "lucide-react";
import useAllWindows from "@/newtab/hooks/useAllWindows";
import { useWorkspaceStore } from "@/newtab/store/workspace";
import type { Workspace, WorkspaceGroup } from "@/newtab/types/workspace";
import { useTranslation } from "react-i18next";

const SnapshotButton = ({
  closeWindowsAfterSnapshot,
}: {
  closeWindowsAfterSnapshot: boolean;
}) => {
  const { t } = useTranslation();
  const { allWindows } = useAllWindows();
  const { addWorkspace } = useWorkspaceStore();

  const handleSnapshot = async () => {
    try {
      if (allWindows.length === 0) {
        alert(t("snapshot.noWindows"));
        return;
      }

      // 각 윈도우를 그룹으로 변환
      const groups: WorkspaceGroup[] = allWindows
        .filter((window) => window.tabs && window.tabs.length > 0)
        .map((window, windowIndex) => {
          const groupId = crypto.randomUUID();
          return {
            id: groupId,
            name: t("browser.windowTitle", { number: windowIndex + 1 }),
            // 스냅샷된 탭은 고유한 문자열 ID 부여 (실제 Chrome 탭과 구분)
            tabs: (window.tabs || []).map((tab, tabIndex) => ({
              ...tab,
              id: `snapshot-${Date.now()}-${windowIndex}-${tabIndex}` as any,
            })),
          };
        });

      if (groups.length === 0) {
        alert(t("snapshot.noTabs"));
        return;
      }

      // 새 워크스페이스 생성
      const newWorkspace: Workspace = {
        id: crypto.randomUUID(),
        name: t("snapshot.defaultName", {
          date: new Date().toLocaleString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          }),
        }),
        createdAt: new Date().toISOString(),
        groups,
        groupViewMode: 1,
        tabViewMode: 1,
      };

      addWorkspace(newWorkspace);

      // 윈도우 닫기 옵션이 활성화되어 있으면 모든 윈도우 닫기
      if (!closeWindowsAfterSnapshot) {
        // 현재 확장 프로그램이 실행 중인 새 탭 페이지는 제외하고 닫기
        const windowsToClose = allWindows.filter(
          (window) => window.id !== undefined
        );

        // 병렬로 모든 윈도우 닫기 (Chrome API는 Promise를 반환하지 않으므로)
        for (const window of windowsToClose) {
          if (window.id) {
            chrome.windows.remove(window.id);
          }
        }
      }

      alert(t("snapshot.success", { count: groups.length }));
    } catch (error) {
      console.error("스냅샷 생성 실패:", error);
      alert(t("snapshot.fail"));
    }
  };

  return (
    <button
      onClick={handleSnapshot}
      className="intro-snapshot-button group flex items-center gap-0 px-3 py-2 bg-blue-500 hover:bg-blue-600 active:scale-95 text-white rounded-full transition-all duration-200 font-medium shadow-sm hover:shadow-md overflow-hidden"
    >
      <Camera className="size-4" />
      <span className="opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap group-hover:ml-2 max-w-0 group-hover:max-w-20 overflow-hidden">
        {t("snapshot.button")}
      </span>
    </button>
  );
};

export default SnapshotButton;
