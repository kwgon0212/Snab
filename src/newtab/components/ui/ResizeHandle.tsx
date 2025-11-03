import { cn } from "@/utils/cn";
import { useEffect, useRef, useState } from "react";

interface ResizeHandleProps {
  onResize: React.Dispatch<React.SetStateAction<number>>;
  strokeWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  className?: string;
  direction?: "horizontal" | "vertical";
  initialWidth?: number;
  resizeTarget?: "left" | "right"; // 리사이즈할 대상이 왼쪽인지 오른쪽인지
}

const ResizeHandle = ({
  onResize,
  strokeWidth = 1,
  minWidth = 250,
  maxWidth = 800,
  className,
  direction = "horizontal",
  initialWidth = 300,
  resizeTarget = "right",
}: ResizeHandleProps) => {
  const [isResizing, setIsResizing] = useState(false);
  const [startPosition, setStartPosition] = useState(0);
  const [startWidth, setStartWidth] = useState(initialWidth);
  const resizeHandleRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
    e.stopPropagation();

    // 시작 위치와 현재 너비 저장
    if (direction === "horizontal") {
      setStartPosition(e.clientX);
    } else {
      setStartPosition(e.clientY);
    }
    setStartWidth(initialWidth);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;

    let newWidth: number;
    const delta =
      direction === "horizontal"
        ? e.clientX - startPosition
        : e.clientY - startPosition;

    // resizeTarget에 따라 계산 방향 결정
    if (resizeTarget === "right") {
      // 오른쪽 요소를 리사이즈: 오른쪽으로 드래그하면 줄어들고, 왼쪽으로 드래그하면 늘어남
      newWidth = startWidth - delta;
    } else {
      // 왼쪽 요소를 리사이즈: 왼쪽으로 드래그하면 줄어들고, 오른쪽으로 드래그하면 늘어남
      newWidth = startWidth + delta;
    }

    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
    onResize(clampedWidth);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (isResizing) {
      document.body.style.cursor =
        direction === "horizontal" ? "col-resize" : "row-resize";
      document.body.style.userSelect = "none";

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, direction, startPosition, startWidth]);

  const isHorizontal = direction === "horizontal";

  return (
    <div
      ref={resizeHandleRef}
      className={cn(
        isHorizontal
          ? `w-full h-full cursor-col-resize`
          : `h-full w-full cursor-row-resize`,
        "bg-slate-300 hover:bg-blue-400 transition-all duration-300 z-30 relative",
        isResizing && "bg-blue-400",
        className
      )}
      onMouseDown={handleMouseDown}
      style={{
        width: isHorizontal ? `${strokeWidth}px` : "100%",
        height: isHorizontal ? "100%" : `${strokeWidth}px`,
        cursor: isHorizontal ? "col-resize" : "row-resize",
        userSelect: "none",
      }}
    />
  );
};

export default ResizeHandle;
