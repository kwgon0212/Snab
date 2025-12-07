import { renderHook, act } from "@testing-library/react";
import { useGroupActions } from "../useGroupActions";
import { vi, describe, it, expect, beforeEach } from "vitest";

const mockUpdateWorkspace = vi.fn();
const mockActiveWorkspace = {
  id: "ws-1",
  groups: [
    { id: "g-1", name: "Group 1", tabs: [] },
  ],
};

vi.mock("@/newtab/store/workspace", () => ({
  useWorkspaceStore: () => ({
    activeWorkspace: mockActiveWorkspace,
    updateWorkspace: mockUpdateWorkspace,
  }),
}));

describe("useGroupActions", () => {
  beforeEach(() => {
    // Basic window mocks
    global.confirm = vi.fn(() => true);
    global.alert = vi.fn();
    mockUpdateWorkspace.mockClear();
  });

  it("should rename group correctly", () => {
    const { result } = renderHook(() => useGroupActions());
    const group = mockActiveWorkspace.groups[0];

    act(() => {
      result.current.handleEditGroupName(group as any, "New Name");
    });

    expect(mockUpdateWorkspace).toHaveBeenCalledWith("ws-1", {
      groups: [{ ...group, name: "New Name" }],
    });
  });

  it("should not rename if name is too long", () => {
    const { result } = renderHook(() => useGroupActions());
    const group = mockActiveWorkspace.groups[0];
    const longName = "This name is definitely way too long for a group name";

    act(() => {
      result.current.handleEditGroupName(group as any, longName);
    });

    expect(global.alert).toHaveBeenCalled();
    expect(mockUpdateWorkspace).toHaveBeenCalledWith("ws-1", {
      groups: [{ ...group, name: longName.slice(0, 20) }],
    });
  });

  it("should delete group after confirmation", () => {
    const { result } = renderHook(() => useGroupActions());
    const group = mockActiveWorkspace.groups[0];

    act(() => {
      result.current.handleDeleteGroup(group as any);
    });

    expect(global.confirm).toHaveBeenCalled();
    expect(mockUpdateWorkspace).toHaveBeenCalledWith("ws-1", {
      groups: [],
    });
  });
});
