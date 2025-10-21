import { X } from "lucide-react";
import { cn } from "../../../utils/cn";

const CloseTab = ({
  tabId,
  className,
}: {
  tabId: number;
  className: string;
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    chrome.tabs.remove(tabId);
  };

  return (
    <button onClick={handleClick} className={cn("cursor-pointer", className)}>
      <X className="size-4" />
    </button>
  );
};

export default CloseTab;
