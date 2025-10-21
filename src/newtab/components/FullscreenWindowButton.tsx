import { Maximize2, Minimize2 } from "lucide-react";

const FullscreenWindowButton = ({
  windowId,
  windowState,
}: {
  windowId: number;
  windowState: chrome.windows.Window["state"];
}) => {
  const isFullscreen = windowState === "fullscreen";

  const handleToggleFullscreen = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    e.preventDefault();

    if (isFullscreen) {
      await chrome.windows.update(windowId, { state: "maximized" });
    } else {
      await chrome.windows.update(windowId, { state: "fullscreen" });
    }
  };

  return (
    <button
      onClick={handleToggleFullscreen}
      className="size-3.5 rounded-full bg-green-400 hover:bg-green-500 hover:scale-120 transition-all duration-300 flex items-center justify-center group"
      aria-label={isFullscreen ? "전체화면 해제" : "전체화면"}
      title={isFullscreen ? "전체화면 해제" : "전체화면"}
    >
      {isFullscreen ? (
        <Minimize2 className="size-2 text-green-800 opacity-0 group-hover:opacity-100 transition-all duration-300" />
      ) : (
        <Maximize2 className="size-2 text-green-800 opacity-0 group-hover:opacity-100 transition-all duration-300" />
      )}
    </button>
  );
};

export default FullscreenWindowButton;
