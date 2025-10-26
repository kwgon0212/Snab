import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { cn } from "@/utils/cn";
import { ChevronRight } from "lucide-react";
import Content from "./Content";
import { type Workspace } from "@/store/workspace";

const Workspace = () => {
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [isResizing, setIsResizing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(
    null
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;

    const newWidth = e.clientX;
    const minWidth = 200;
    const maxWidth = 400;

    if (newWidth >= minWidth && newWidth <= maxWidth) {
      setSidebarWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // 마우스 이벤트 리스너 등록
  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div className="flex-1 size-full flex relative overflow-hidden">
      <div
        className={cn(
          "bg-slate-50 relative z-10 flex-shrink-0",
          isCollapsed
            ? "w-0 opacity-0 transition-all duration-300"
            : "opacity-100",
          !isResizing && !isCollapsed && "transition-all duration-300"
        )}
        style={{ width: isCollapsed ? "0px" : `${sidebarWidth}px` }}
      >
        <div
          className={cn(
            "transition-all duration-300 ease-in-out overflow-hidden h-full",
            isCollapsed
              ? "transform -translate-x-full opacity-0"
              : "transform translate-x-0 opacity-100"
          )}
        >
          <Sidebar onWorkspaceChange={setActiveWorkspace} />
        </div>
      </div>

      {/* 리사이즈 핸들 */}
      {!isCollapsed && (
        <div
          className={cn(
            "absolute top-0 bottom-0 w-[1px] bg-slate-300 hover:bg-blue-400 cursor-col-resize z-20",
            !isResizing && "transition-all duration-300"
          )}
          style={{ left: `${sidebarWidth}px` }}
          onMouseDown={handleMouseDown}
        />
      )}

      {/* 토글 버튼 */}
      <button
        onClick={toggleSidebar}
        className={cn(
          "absolute top-1/2 -translate-y-1/2 w-8 h-12 bg-white border border-slate-200 hover:border-blue-400 text-slate-400 hover:text-blue-500 rounded-full flex items-center justify-center shadow-sm hover:shadow-md backdrop-blur-sm z-30 transition-all duration-300",
          !isResizing && "transition-all duration-300"
        )}
        style={{
          left: isCollapsed ? "0px" : `${sidebarWidth}px`,
          transform: isCollapsed
            ? "translateY(-50%) translateX(0)"
            : "translateY(-50%) translateX(-50%)",
          opacity: isCollapsed ? 0.6 : 1,
        }}
        title={isCollapsed ? "사이드바 열기" : "사이드바 닫기"}
      >
        <ChevronRight
          className={cn(
            "w-4 h-4 transition-transform duration-300 ease-in-out",
            isCollapsed ? "rotate-0" : "rotate-180"
          )}
        />
      </button>

      <Content
        activeWorkspace={activeWorkspace}
        onWorkspaceUpdate={setActiveWorkspace}
      />
    </div>
  );
};

export default Workspace;
