import { describe, it, expect, vi, beforeEach } from "vitest";
import { cn } from "../cn";
import {
  exportAllData,
  importDataFromJSON,
  downloadDataAsJSON,
} from "../dataExport";
import {
  loadAllWindows,
  createWindow,
  closeWindow,
  minimizeWindow,
  fullscreenWindow,
} from "../windows";
import { Workspace } from "@/newtab/types/workspace";

// Mock chrome API
const chromeMock = {
  storage: {
    local: {
      get: vi.fn(),
      set: vi.fn(),
    },
  },
  windows: {
    getAll: vi.fn(),
    create: vi.fn(),
    remove: vi.fn(),
    update: vi.fn(),
  },
  tabs: {
    query: vi.fn(),
  },
};

global.chrome = chromeMock as any;

// Mock URL
global.URL.createObjectURL = vi.fn(() => "blob:url");
global.URL.revokeObjectURL = vi.fn();

describe("Utils Tests", () => {
  describe("cn", () => {
    it("should merge class names correctly", () => {
      expect(cn("text-red-500", "bg-blue-500")).toBe(
        "text-red-500 bg-blue-500"
      );
    });

    it("should handle conditional classes", () => {
      const isTrue = true;
      const isFalse = false;
      expect(cn("base-class", isTrue && "active", isFalse && "inactive")).toBe(
        "base-class active"
      );
    });

    it("should resolve tailwind conflicts", () => {
      expect(cn("px-2 py-1", "p-4")).toBe("p-4"); // p-4 overrides px-2 py-1
    });
  });

  describe("dataExport", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("exportAllData should return JSON string of workspaces", async () => {
      const mockWorkspaces: Workspace[] = [
        {
          id: "1",
          name: "Test WS",
          groups: [],
          createdAt: "",
          groupViewMode: 1,
          tabViewMode: 1,
        },
      ];
      chromeMock.storage.local.get.mockResolvedValue({
        workspaces: mockWorkspaces,
      });

      const json = await exportAllData();
      const data = JSON.parse(json);

      expect(data.workspaces).toHaveLength(1);
      expect(data.workspaces[0].id).toBe("1");
      expect(data.version).toBeDefined();
    });

    it("importDataFromJSON should save imported workspaces", async () => {
      const mockCurrentWorkspaces: Workspace[] = [
        {
          id: "old",
          name: "Old WS",
          groups: [],
          createdAt: "",
          groupViewMode: 1,
          tabViewMode: 1,
        },
      ];
      chromeMock.storage.local.get.mockResolvedValue({
        workspaces: mockCurrentWorkspaces,
      });

      const importData = {
        workspaces: [
          {
            id: "new",
            name: "New WS",
            groups: [],
            createdAt: "",
            groupViewMode: 1,
            tabViewMode: 1,
          },
        ],
        exportDate: new Date().toISOString(),
        version: "1.0.0",
      };
      const file = new File([JSON.stringify(importData)], "backup.json", {
        type: "application/json",
      });
      // Mock text() method as it might be missing in jsdom
      Object.defineProperty(file, "text", {
        value: () => Promise.resolve(JSON.stringify(importData)),
      });

      await importDataFromJSON(file);

      expect(chromeMock.storage.local.set).toHaveBeenCalledTimes(1);
      const setCall = chromeMock.storage.local.set.mock.calls[0][0];
      expect(setCall.workspaces).toHaveLength(2); // Old + New
      expect(setCall.workspaces[1].name).toContain("(업로드)");
    });

    it("downloadDataAsJSON should trigger download", async () => {
      const mockWorkspaces: Workspace[] = [];
      chromeMock.storage.local.get.mockResolvedValue({
        workspaces: mockWorkspaces,
      });

      // Mock document methods
      const link = { click: vi.fn(), href: "", download: "" };
      const createElementSpy = vi
        .spyOn(document, "createElement")
        .mockReturnValue(link as any);
      const appendChildSpy = vi
        .spyOn(document.body, "appendChild")
        .mockImplementation(() => link as any);
      const removeChildSpy = vi
        .spyOn(document.body, "removeChild")
        .mockImplementation(() => link as any);

      await downloadDataAsJSON();

      expect(createElementSpy).toHaveBeenCalledWith("a");
      expect(link.click).toHaveBeenCalled();

      createElementSpy.mockRestore();
      appendChildSpy.mockRestore();
      removeChildSpy.mockRestore();
    });
  });

  describe("windows", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("loadAllWindows should call chrome.windows.getAll", async () => {
      const mockWindows = [{ id: 1 }];
      chromeMock.windows.getAll.mockResolvedValue(mockWindows);

      const result = await loadAllWindows();
      expect(chromeMock.windows.getAll).toHaveBeenCalledWith({
        populate: true,
      });
      expect(result).toEqual(mockWindows);
    });

    it("createWindow should call chrome.windows.create", async () => {
      await createWindow();
      expect(chromeMock.windows.create).toHaveBeenCalledWith({
        focused: true,
        type: "normal",
      });
    });

    it("closeWindow should call chrome.windows.remove", async () => {
      await closeWindow(123);
      expect(chromeMock.windows.remove).toHaveBeenCalledWith(123);
    });

    it("minimizeWindow should call chrome.windows.update", async () => {
      await minimizeWindow(123);
      expect(chromeMock.windows.update).toHaveBeenCalledWith(123, {
        state: "minimized",
      });
    });

    it("fullscreenWindow should call chrome.windows.update", async () => {
      await fullscreenWindow(123);
      expect(chromeMock.windows.update).toHaveBeenCalledWith(123, {
        state: "fullscreen",
      });
    });
  });
});
