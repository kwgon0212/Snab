import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import useOutsideClick from "../useOutsideClick";
import useAllWindows from "../useAllWindows";
import { useRef } from "react";

// Mock chrome API (if not already global)
const chromeMock = {
  windows: {
    getAll: vi.fn(),
    onCreated: { addListener: vi.fn(), removeListener: vi.fn() },
    onRemoved: { addListener: vi.fn(), removeListener: vi.fn() },
    onBoundsChanged: { addListener: vi.fn(), removeListener: vi.fn() },
    onFocusChanged: { addListener: vi.fn(), removeListener: vi.fn() },
  },
  tabs: {
    onCreated: { addListener: vi.fn(), removeListener: vi.fn() },
    onRemoved: { addListener: vi.fn(), removeListener: vi.fn() },
    onUpdated: { addListener: vi.fn(), removeListener: vi.fn() },
  },
};

global.chrome = chromeMock as any;

describe("Hooks Tests", () => {
  describe("useOutsideClick", () => {
    it("should call callback when clicking outside", () => {
      const callback = vi.fn();
      const ref = { current: document.createElement("div") };

      renderHook(() => useOutsideClick(ref as any, callback));

      // Simulate click outside
      act(() => {
        const event = new MouseEvent("mousedown", { bubbles: true });
        document.dispatchEvent(event);
      });

      expect(callback).toHaveBeenCalled();
    });

    it("should NOT call callback when clicking inside", () => {
      const callback = vi.fn();
      const div = document.createElement("div");
      document.body.appendChild(div);
      const ref = { current: div };

      renderHook(() => useOutsideClick(ref as any, callback));

      // Simulate click inside
      act(() => {
        const event = new MouseEvent("mousedown", { bubbles: true });
        div.dispatchEvent(event);
      });

      expect(callback).not.toHaveBeenCalled();
      document.body.removeChild(div);
    });
  });

  describe("useAllWindows", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should fetch windows on mount", async () => {
      const mockWindows = [{ id: 1 }];
      chromeMock.windows.getAll.mockResolvedValue(mockWindows);

      const { result } = renderHook(() => useAllWindows());

      // Initial state might be empty, wait for update
      await act(async () => {
        // Wait for promise resolution (microtask)
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(result.current.allWindows).toEqual(mockWindows);
      expect(chromeMock.windows.getAll).toHaveBeenCalled();
    });

    it("should register event listeners", () => {
      renderHook(() => useAllWindows());
      expect(chromeMock.tabs.onCreated.addListener).toHaveBeenCalled();
      expect(chromeMock.windows.onCreated.addListener).toHaveBeenCalled();
    });

    it("should remove event listeners on unmount", () => {
      const { unmount } = renderHook(() => useAllWindows());
      unmount();
      expect(chromeMock.tabs.onCreated.removeListener).toHaveBeenCalled();
      expect(chromeMock.windows.onCreated.removeListener).toHaveBeenCalled();
    });
  });
});
