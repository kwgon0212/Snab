import { useState } from "react";
import ResizeHandle from "../../ui/ResizeHandle";
import Sidebar from "./Sidebar";
import Content from "./Content";
import ToggleSidebar from "./ToggleSidebar";

const Workspace = () => {
  const [asideWidth, setAsideWidth] = useState(250);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <section className="flex-1 flex w-full">
      {!isCollapsed && (
        <>
          <Sidebar width={asideWidth} />
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
      />
    </section>
  );
};

export default Workspace;
