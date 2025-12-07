import { useState } from "react";
import ResizeHandle from "@/newtab/components/ui/ResizeHandle";
import SidebarContainer from "../containers/SidebarContainer";
import Content from "./Content";
import ToggleSidebar from "./ToggleSidebar";

const WorkspaceLayout = () => {
  const [asideWidth, setAsideWidth] = useState(250);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <section className="flex-1 flex w-full">
      {!isCollapsed && (
        <>
          <SidebarContainer width={asideWidth} />
          <ResizeHandle
            onResize={setAsideWidth}
            minWidth={200}
            maxWidth={300}
            direction="horizontal"
            initialWidth={asideWidth}
            resizeTarget="left"
          />
        </>
      )}

      <Content />

      <ToggleSidebar
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
        width={asideWidth}
      />
    </section>
  );
};

export default WorkspaceLayout;
