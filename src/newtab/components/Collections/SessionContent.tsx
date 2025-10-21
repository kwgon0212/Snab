// 세션 컨텐츠 표시 컴포넌트
import React from "react";
import type { SessionLeaf } from "@/types/collection";

interface SessionContentProps {
  session: SessionLeaf;
  onOpenSession: (sessionId: string) => void;
}

export default function SessionContent({
  session,
  onOpenSession,
}: SessionContentProps) {
  const [tabs, setTabs] = React.useState<any[]>([]);

  React.useEffect(() => {
    // 세션 데이터 로드
    chrome.storage.local.get("snapshots").then((result) => {
      const snapshots = result.snapshots || [];
      const snapshot = snapshots.find(
        (s: any) => s.id === parseInt(session.sessionId)
      );
      setTabs(snapshot?.tabs || []);
    });
  }, [session.sessionId]);

  return (
    <div>
      {/* 헤더 */}
      <div className="mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{session.name}</h2>
            <p className="text-sm text-gray-500 mt-1">{tabs.length}개의 탭</p>
          </div>
          <button
            onClick={() => onOpenSession(session.sessionId)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
            모든 탭 열기
          </button>
        </div>
      </div>

      {/* 탭 리스트 */}
      <div className="grid gap-3">
        {tabs.length > 0 ? (
          tabs.map((tab: any, index: number) => (
            <a
              key={`${tab.url}-${index}`}
              href={tab.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 bg-white"
            >
              {/* Favicon */}
              <div className="flex-shrink-0 w-6 h-6">
                {tab.faviconUrl ? (
                  <img
                    src={tab.faviconUrl}
                    alt=""
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center text-xs">
                    🌐
                  </div>
                )}
              </div>

              {/* 제목과 URL */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-800 truncate group-hover:text-blue-600 transition-colors">
                  {tab.title || "제목 없음"}
                </h4>
                <p className="text-xs text-gray-500 truncate mt-0.5">
                  {tab.url}
                </p>
              </div>

              {/* 외부 링크 아이콘 */}
              <svg
                className="w-4 h-4 text-gray-400 group-hover:text-blue-500 flex-shrink-0 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          ))
        ) : (
          <div className="text-center text-gray-400 py-8">
            저장된 탭이 없습니다
          </div>
        )}
      </div>
    </div>
  );
}
