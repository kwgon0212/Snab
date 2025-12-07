import { cn } from "@/utils/cn";
import React, { useEffect, useRef } from "react";

interface EditBlurInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  editingName: string;
  setEditingName: (value: string) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
  value: string;
}

const EditBlurInput = ({
  isEditing,
  setIsEditing,
  editingName,
  setEditingName,
  value,
  onBlur,
  className,
  ...rest
}: EditBlurInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  return isEditing ? (
    <input
      ref={inputRef}
      type="text"
      value={editingName}
      onChange={(e) => setEditingName(e.target.value)}
      className={cn(
        "font-semibold text-slate-800 border-none outline-none inline-block",
        className
      )}
      onBlur={onBlur}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.currentTarget.blur();
        }
        if (e.key === "Escape") {
          setEditingName(value);
          setIsEditing(false);
        }
      }}
      autoFocus
      {...rest}
    />
  ) : (
    <span className={cn("font-semibold text-slate-600", className)}>
      {value}
    </span>
  );
};

export default EditBlurInput;
