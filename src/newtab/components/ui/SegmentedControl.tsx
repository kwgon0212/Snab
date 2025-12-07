import { cn } from "@/utils/cn";
import { motion } from "framer-motion";

interface Option {
  value: number | string;
  label: string;
}

interface SegmentedControlProps {
  options: Option[];
  value: number | string;
  onChange: (value: number | string) => void;
  className?: string;
  name: string; // Unique name for layoutId
}

const SegmentedControl = ({
  options,
  value,
  onChange,
  className,
  name,
}: SegmentedControlProps) => {
  return (
    <div
      role="radiogroup"
      className={cn(
        "flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg gap-1 relative",
        className
      )}
    >
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <button
            key={option.value}
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(option.value)}
            className={cn(
              "relative px-3 py-1.5 text-xs font-medium rounded-md transition-colors z-10",
              isSelected
                ? "text-blue-600 dark:text-white"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            )}
          >
            {isSelected && (
              <motion.div
                layoutId={`segmented-control-bg-${name}`}
                className="absolute inset-0 bg-white dark:bg-slate-600 rounded-md shadow-sm border border-slate-200 dark:border-slate-500 -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
              />
            )}
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export default SegmentedControl;
