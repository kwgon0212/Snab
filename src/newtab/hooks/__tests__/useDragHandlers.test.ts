import { renderHook, act } from "@testing-library/react";
import { useDragHandlers } from "../useDragHandlers";
import { vi, describe, it, expect, beforeEach } from "vitest";

// Mock useWorkspaceStore
const mockUpdateWorkspace = vi.fn();
const mockActiveWorkspace = {
  id: "ws-1",
  groups: [
    {
      id: "group-1",
      tabs: [{ id: 101, url: "http://test.com", title: "Test Tab" }],
    },
    {
      id: "group-2",
      tabs: [],
    },
  ],
};

vi.mock("../store/workspace", () => ({
  useWorkspaceStore: () => ({
    activeWorkspace: mockActiveWorkspace,
    updateWorkspace: mockUpdateWorkspace,
  }),
}));

describe("useDragHandlers", () => {
  let allWindows: chrome.windows.Window[];
  let setAllWindows: any;

  beforeEach(() => {
    allWindows = [{ id: 1, tabs: [{ id: 201, windowId: 1, index: 0 }] }] as any;
    setAllWindows = vi.fn();
    mockUpdateWorkspace.mockClear();
    vi.clearAllMocks();
  });

  it("should initialize with no dragging tab", () => {
    const { result } = renderHook(() =>
      useDragHandlers(allWindows, setAllWindows)
    );
    expect(result.current.draggingTab).toBeNull();
  });

  it("should set dragging tab on drag start", () => {
    const { result } = renderHook(() =>
      useDragHandlers(allWindows, setAllWindows)
    );

    const event: any = {
      active: {
        data: {
          current: {
            tabInfo: { id: 123 },
          },
        },
      },
    };

    act(() => {
      result.current.handleDragStart(event);
    });

    expect(result.current.draggingTab).toEqual({ id: 123 });
  });

  // More tests can be added for handleDragEnd logic
  // Since the logic is complex and involves many mocks, we start with basic sanity checks
});
