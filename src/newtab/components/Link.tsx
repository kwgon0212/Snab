import { useDraggable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";
import { cn } from "@/utils/cn";

interface LinkProps {
  url: string;
  title: string;
  faviconUrl: string;
  favIconUrl: string;
}

// active: false
// audible: false
// autoDiscardable: true
// discarded: false
// favIconUrl: "https://lucide.dev/favicon.ico"
// frozen: false
// groupId: -1
// height: 1004
// highlighted: false
// id: 1106932339
// incognito: false
// index: 0
// lastAccessed: 1761032684314.845
// mutedInfo: {muted: false}
// pinned: false
// selected: false
// splitViewId: -1
// status: "complete"
// title: "Lucide"
// url: "https://lucide.dev/icons/?search=folder"
// width: 1800
// windowId: 1106932321

const Link = ({
  id,
  onClick,
  children,
  className,
}: {
  id: number;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    // zIndex: isDragging ? 1000 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`${className} transition-transform duration-200 ease-out`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Link;
