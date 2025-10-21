import { Loader2, Plus } from "lucide-react";
import { addTabToWindow } from "../../../utils/tabs";
import { useState } from "react";
import { normalizeUrl, isValidUrl } from "../../../utils/url";

const AddTab = ({
  windowId,
}: {
  windowId: chrome.windows.Window["id"] | undefined;
}) => {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitURL = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!url.trim()) return;

    try {
      setIsLoading(true);
      setError(null);
      const normalizedUrl = normalizeUrl(url);
      if (!isValidUrl(normalizedUrl)) {
        throw new Error("올바른 URL을 입력해주세요.");
      }
      await addTabToWindow(windowId!, normalizedUrl);

      // 성공 시 입력창 초기화
      setUrl("");
      setError(null);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "탭 생성에 실패했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <form
        onSubmit={handleSubmitURL}
        className="w-full flex items-center gap-2"
      >
        <input
          type="text"
          value={url}
          placeholder="URL 입력 (예: https://example.com)"
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 h-10 px-3 rounded-lg outline-none border border-slate-300 text-sm focus:border-blue-500 placeholder:text-slate-400"
        />
        <button
          type="submit"
          aria-label="탭 추가"
          className="h-10 w-10 inline-flex items-center justify-center rounded-lg bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 transition-colors disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Plus className="w-5 h-5" />
          )}
        </button>
      </form>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default AddTab;
