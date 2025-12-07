import { render, screen, fireEvent } from "@testing-library/react";
import GroupCard from "../GroupCard";
import { describe, it, expect, vi } from "vitest";

// Mock dnd-kit
vi.mock("@dnd-kit/core", () => ({
  useDroppable: () => ({ setNodeRef: vi.fn(), isOver: false }),
  useDndContext: () => ({ active: null }),
}));

vi.mock("@dnd-kit/sortable", () => ({
  SortableContext: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  rectSortingStrategy: {},
}));

// Mock Tab component
vi.mock("@/newtab/components/ui/Tab", () => ({
  default: () => <div data-testid="tab">Tab</div>,
}));

// Mock Tooltip
vi.mock("@/newtab/components/ui/Tooltip", () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

// Mock EditBlurInput
vi.mock("@/newtab/components/ui/EditBlurInput", () => ({
  default: ({ value, onBlur, onChange }: any) => (
    <input
      data-testid="edit-input"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
    />
  ),
}));

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("GroupCard", () => {
  const mockGroup = {
    id: "group-1",
    name: "Test Group",
    tabs: [
      { id: 1, url: "http://example.com", title: "Example" },
      { id: 2, url: "http://test.com", title: "Test" },
    ],
  } as any;

  const defaultProps = {
    group: mockGroup,
    workspaceId: "ws-1",
    tabViewMode: 1 as const,
    onRename: vi.fn(),
    onDelete: vi.fn(),
    onOpenWindow: vi.fn(),
  };

  it("renders group name correctly", () => {
    render(<GroupCard {...defaultProps} />);
    expect(screen.getByTestId("edit-input")).toHaveValue("Test Group");
  });

  it("renders correct number of tabs", () => {
    render(<GroupCard {...defaultProps} />);
    expect(screen.getAllByTestId("tab")).toHaveLength(2);
  });

  it("calls onDelete when delete button is clicked", () => {
    render(<GroupCard {...defaultProps} />);
    const deleteButton = screen.getByTitle("groupCard.deleteGroup");
    fireEvent.click(deleteButton);
    expect(defaultProps.onDelete).toHaveBeenCalledWith(mockGroup);
  });

  it("calls onOpenWindow when external link button is clicked", () => {
    render(<GroupCard {...defaultProps} />);
    const openButton = screen.getByTitle("groupCard.openWindow");
    fireEvent.click(openButton);
    expect(defaultProps.onOpenWindow).toHaveBeenCalledWith(mockGroup);
  });
});
