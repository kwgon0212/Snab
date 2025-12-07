import { cn } from "@/utils/cn";
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

const Tooltip = ({
  children,
  title,
  position = "bottom",
  offset = 4, // 툴팁과 요소 사이의 거리 (px)
}: {
  children: React.ReactNode;
  title: string;
  position?: "bottom" | "top" | "left" | "right";
  offset?: number;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const updatePosition = () => {
        if (!triggerRef.current || !tooltipRef.current) return;

        const triggerRect = triggerRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();

        let top = 0;
        let left = 0;

        switch (position) {
          case "bottom":
            top = triggerRect.bottom + window.scrollY + offset;
            left = triggerRect.left + window.scrollX + triggerRect.width / 2;
            break;
          case "top":
            top =
              triggerRect.top + window.scrollY - tooltipRect.height - offset;
            left = triggerRect.left + window.scrollX + triggerRect.width / 2;
            break;
          case "left":
            top = triggerRect.top + window.scrollY + triggerRect.height / 2;
            left =
              triggerRect.left + window.scrollX - tooltipRect.width - offset;
            break;
          case "right":
            top = triggerRect.top + window.scrollY + triggerRect.height / 2;
            left = triggerRect.right + window.scrollX + offset;
            break;
        }

        setTooltipStyle({
          top: `${top}px`,
          left: `${left}px`,
          transform:
            position === "bottom" || position === "top"
              ? "translateX(-50%)"
              : position === "left" || position === "right"
              ? "translateY(-50%)"
              : "none",
        });
      };

      // 툴팁이 렌더링된 후 위치 계산
      requestAnimationFrame(() => {
        requestAnimationFrame(updatePosition);
      });
    }
  }, [isVisible, position]);

  const tooltipContent = isVisible && (
    <div
      ref={tooltipRef}
      className={cn(
        "fixed bg-slate-700 dark:bg-slate-300 text-white dark:text-black text-xs rounded-md px-2 py-1 shadow-lg z-[9999] whitespace-nowrap pointer-events-none",
        "transition-opacity duration-200",
        isVisible ? "opacity-100" : "opacity-0"
      )}
      style={tooltipStyle}
    >
      {title}
    </div>
  );

  return (
    <>
      <div
        ref={triggerRef}
        className="inline-block"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {typeof window !== "undefined" &&
        createPortal(tooltipContent, document.body)}
    </>
  );
};

export default Tooltip;
