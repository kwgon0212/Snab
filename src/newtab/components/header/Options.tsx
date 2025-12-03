import { useRef, useState } from "react";
import {
  MoreHorizontal,
  HardDriveDownload,
  HardDriveUpload,
  HelpCircle,
} from "lucide-react";
import useOutsideClick from "@/newtab/hooks/useOutsideClick";
import {
  downloadDataAsJSON,
  selectAndImportJSON,
  importDataFromJSON,
} from "@/utils/dataExport";
import { useWorkspaceStore } from "@/newtab/store/workspace";
import { startIntro } from "../Intro";

const Options = () => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { loadWorkspaces } = useWorkspaceStore();
  useOutsideClick(menuRef, () => setIsMenuOpen(false));

  const handleExportData = async () => {
    try {
      await downloadDataAsJSON();
      setIsMenuOpen(false);
      alert("데이터가 성공적으로 내보내졌습니다.");
    } catch (error) {
      console.error("데이터 내보내기 실패:", error);
      alert("데이터 내보내기에 실패했습니다.");
    }
  };

  const handleImportData = async () => {
    try {
      const file = await selectAndImportJSON();
      if (!file) {
        return;
      }

      const success = await importDataFromJSON(file);
      if (success) {
        // 워크스페이스 스토어 다시 로드
        await loadWorkspaces();
        setIsMenuOpen(false);
        alert("데이터가 성공적으로 가져와졌습니다.");
      }
    } catch (error) {
      console.error("데이터 가져오기 실패:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "데이터 가져오기에 실패했습니다.";
      alert(errorMessage);
    }
  };

  const handleIntro = async () => {
    try {
      // 튜토리얼 완료 상태를 초기화하고 다시 보기
      await chrome.storage.local.set({ tutorialCompleted: false });
      startIntro();
      setIsMenuOpen(false);
    } catch (error) {
      console.error("튜토리얼 실행 실패:", error);
      startIntro();
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="relative intro-options-menu" ref={menuRef}>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="group flex items-center gap-0 px-3 py-2 hover:bg-slate-100 active:scale-95 text-gray-800 rounded-md transition-all duration-200 font-medium overflow-hidden"
        title="메뉴"
      >
        <MoreHorizontal className="size-4" />
      </button>

      {/* 드롭다운 메뉴 */}
      {isMenuOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-slate-200 z-50">
          <button
            onClick={handleExportData}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-200"
          >
            <HardDriveDownload className="size-4" />
            JSON 다운로드
          </button>
          <button
            onClick={handleImportData}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-200"
          >
            <HardDriveUpload className="size-4" />
            JSON 업로드
          </button>
          <button
            onClick={handleIntro}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-200"
          >
            <HelpCircle className="size-4" />
            튜토리얼 보기
          </button>
        </div>
      )}
    </div>
  );
};

export default Options;
