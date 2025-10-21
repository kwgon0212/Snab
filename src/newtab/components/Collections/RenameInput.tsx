// 이름 변경 인풋
import React from "react";

interface RenameInputProps {
  initial: string;
  onSubmit: (value: string) => void;
  onCancel: () => void;
}

export default function RenameInput({
  initial,
  onSubmit,
  onCancel,
}: RenameInputProps) {
  const [v, setV] = React.useState(initial);

  return (
    <input
      className="w-32 px-1 py-0.5 border-0 border-b border-gray-300 focus:border-blue-500 bg-transparent focus:outline-none"
      autoFocus
      value={v}
      onChange={(e) => setV(e.target.value)}
      onBlur={() => onSubmit(v)}
      onKeyDown={(e) => {
        if (e.key === "Enter") onSubmit(v);
        if (e.key === "Escape") onCancel();
      }}
    />
  );
}
