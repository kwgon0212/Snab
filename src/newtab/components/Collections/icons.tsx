// 아이콘 컴포넌트들
export const Chevron = ({ open }: { open: boolean }) => (
  <svg
    className={`w-3 h-3 transition-transform ${open ? "rotate-90" : ""}`}
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M8 5l8 7-8 7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const FolderIcon = () => (
  <svg
    className="w-4 h-4 text-amber-500"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M10 4l2 2h8a2 2 0 012 2v1H2V6a2 2 0 012-2h6z" />
    <path d="M2 9h20v9a2 2 0 01-2 2H4a2 2 0 01-2-2V9z" />
  </svg>
);

export const FileIcon = () => (
  <svg
    className="w-4 h-4 text-blue-500"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12V8l-4-6z" />
  </svg>
);
