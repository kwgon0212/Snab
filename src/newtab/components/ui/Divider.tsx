import { cn } from "@/utils/cn";

interface DividerProps {
  direction?: "horizontal" | "vertical";
  /** 길이(px). 0 또는 음수면 부모에 맞춰 꽉 채움 */
  size?: number;
  /** 두께(px) */
  strokeWidth?: number;
  className?: string;
}

const Divider = ({
  direction = "horizontal",
  size, // undefined면 방향별 합리적 기본값 사용
  strokeWidth = 1,
  className,
}: DividerProps) => {
  const isH = direction === "horizontal";

  // 길이: 명시하면 px, 0/음수면 꽉 채움, 미지정이면 '툴바 기본' (h: w-full, v: h-5)
  const stretch = typeof size === "number" && size <= 0;
  const lengthStyle =
    typeof size === "number" && size > 0
      ? isH
        ? { width: size }
        : { height: size }
      : undefined;

  return (
    <div
      role="separator"
      aria-orientation={isH ? "horizontal" : "vertical"}
      className={cn(
        "bg-slate-300",
        // 두께(교차축)
        isH ? "h-px" : "w-px",
        // 길이(주축) 기본값
        isH
          ? stretch
            ? "w-full"
            : typeof size === "number"
            ? ""
            : "w-full"
          : stretch
          ? "h-full"
          : typeof size === "number"
          ? ""
          : "h-5",
        // flex 환경에서 안정화
        "flex-shrink-0",
        // 세로선일 때 부모 정렬이 center여도 강제로 늘리고 싶다면 아래 주석 해제
        // !isH && "self-stretch",
        className
      )}
      style={{
        ...lengthStyle,
        ...(isH ? { height: strokeWidth } : { width: strokeWidth }),
      }}
    />
  );
};

export default Divider;
