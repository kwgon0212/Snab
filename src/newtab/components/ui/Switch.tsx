import { cn } from "@/utils/cn";

interface SwitchProps {
  checked: boolean;
  onChange: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

const Switch = ({
  checked,
  onChange: handleChange,
  className = "",
}: SwitchProps) => {
  return (
    <button
      onClick={handleChange}
      className={cn(
        "relative w-6 h-3 rounded-full transition-colors duration-300 outline-none flex-shrink-0",
        checked ? "bg-blue-500" : "bg-slate-300",
        className
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 bg-white w-2 h-2 rounded-full transition-transform duration-300 shadow-sm",
          checked && "translate-x-3"
        )}
      />
    </button>
  );
};

export default Switch;
