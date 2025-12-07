import { describe, it, expect, beforeEach, vi } from "vitest";
import { useWorkspaceStore } from "../workspace";
import { act } from "@testing-library/react";

describe("useWorkspaceStore", () => {
  beforeEach(() => {
    // Reset store
    act(() => {
      useWorkspaceStore.setState({
        workspaces: [],
        activeWorkspace: null,
      });
    });
    vi.clearAllMocks();
  });

  it("should add a workspace", () => {
    const newWorkspace = {
      id: "ws-1",
      name: "Test Workspace",
      createdAt: new Date().toISOString(),
      groups: [],
    };

    act(() => {
      useWorkspaceStore.getState().addWorkspace(newWorkspace);
    });

    const state = useWorkspaceStore.getState();
    expect(state.workspaces).toHaveLength(1);
    expect(state.workspaces[0]).toEqual(newWorkspace);
    expect(state.activeWorkspace).toEqual(newWorkspace);
    expect(chrome.storage.local.set).toHaveBeenCalledWith({
      workspaces: [newWorkspace],
    });
  });

  it("should update a workspace", () => {
    const workspace = {
      id: "ws-1",
      name: "Original Name",
      createdAt: new Date().toISOString(),
      groups: [],
    };

    act(() => {
      useWorkspaceStore.setState({
        workspaces: [workspace],
        activeWorkspace: workspace,
      });
    });

    act(() => {
      useWorkspaceStore
        .getState()
        .updateWorkspace("ws-1", { name: "Updated Name" });
    });

    const state = useWorkspaceStore.getState();
    expect(state.workspaces[0].name).toBe("Updated Name");
    expect(state.activeWorkspace?.name).toBe("Updated Name");
  });

  it("should not delete the last workspace", () => {
    // Mock window.alert
    window.alert = vi.fn();

    const workspace = {
      id: "ws-1",
      name: "Only Workspace",
      createdAt: "2023-01-01",
      groups: [],
    };

    act(() => {
        useWorkspaceStore.setState({
          workspaces: [workspace],
          activeWorkspace: workspace,
        });
      });

    act(() => {
      useWorkspaceStore.getState().deleteWorkspace("ws-1");
    });

    expect(window.alert).toHaveBeenCalled();
    expect(useWorkspaceStore.getState().workspaces).toHaveLength(1);
  });
});
