// 임시 보관소 - 드래그한 링크들을 임시로 저장
import { useState } from "react";
import { Inbox, X } from "lucide-react";

interface TempLink {
  id: string;
  url: string;
  title: string;
  faviconUrl?: string;
}

export default function TempStorage() {
  const [tempLinks, setTempLinks] = useState<TempLink[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    // URL 데이터 가져오기
    const url =
      e.dataTransfer.getData("text/uri-list") ||
      e.dataTransfer.getData("text/plain");
    const title = e.dataTransfer.getData("text/plain");

    if (url) {
      const newLink: TempLink = {
        id: crypto.randomUUID(),
        url,
        title: title || url,
      };
      setTempLinks((prev) => [...prev, newLink]);
    }
  };

  const removeLink = (id: string) => {
    setTempLinks((prev) => prev.filter((link) => link.id !== id));
  };

  const clearAll = () => {
    if (confirm("모든 임시 링크를 삭제하시겠습니까?")) {
      setTempLinks([]);
    }
  };

  return (
    <div className="flex items-center gap-3 cursor-default">
      {/* 드롭 영역 */}
      <div
        className={`relative px-4 py-2 border-2 border-dashed rounded-lg transition-all ${
          isDragOver
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-white hover:border-gray-400"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        <div className="flex items-center gap-2">
          <Inbox className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-600">
            링크 임시 저장소 ({tempLinks.length})
          </span>
        </div>
      </div>

      {/* 임시 링크 목록 */}
      {tempLinks.length > 0 && (
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200">
          <div className="flex gap-2 max-w-md overflow-x-auto">
            {tempLinks.map((link) => (
              <div
                key={link.id}
                className="group flex items-center gap-2 px-2 py-1 bg-gray-50 rounded border border-gray-200 hover:border-blue-300 transition-colors"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("text/uri-list", link.url);
                  e.dataTransfer.setData("text/plain", link.title);
                }}
              >
                <span
                  className="text-xs truncate max-w-[100px]"
                  title={link.title}
                >
                  {link.title}
                </span>
                <button
                  onClick={() => removeLink(link.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3 text-gray-500 hover:text-red-500" />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={clearAll}
            className="text-xs px-2 py-1 text-red-600 hover:bg-red-50 rounded transition-colors flex-shrink-0"
          >
            전체 삭제
          </button>
        </div>
      )}
    </div>
  );
}
