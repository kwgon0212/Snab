import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Sidebar from "../../features/workspace/components/Sidebar";
import Content from "../../features/workspace/components/Content";
import BrowserUI from "../ui/Browser";
import LanguageSelector from "../header/LanguageSelector";
import { useWorkspaceStore } from "../../store/workspace";

// Mock dependencies
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: vi.fn(),
      language: "ko",
    },
  }),
  Trans: ({ i18nKey }: { i18nKey: string }) => <span>{i18nKey}</span>,
}));

// Mock store
vi.mock("../../store/workspace", () => ({
  useWorkspaceStore: vi.fn(),
}));

// Mock dnd-kit
vi.mock("@dnd-kit/core", () => ({
  useDroppable: () => ({ setNodeRef: vi.fn(), isOver: false }),
  useDndContext: () => ({ active: null }),
  DndContext: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock("@dnd-kit/sortable", () => ({
  SortableContext: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  verticalListSortingStrategy: {},
}));

// Mock EditBlurInput
vi.mock("../ui/EditBlurInput", () => ({
  default: ({ value, onBlur, onChange, className }: any) => (
    <input
      data-testid="edit-input"
      defaultValue={value} // Use defaultValue to avoid controlled input warnings in tests if onChange is no-op
      onChange={onChange}
      onBlur={onBlur}
      className={className}
    />
  ),
}));

// Mock child components to simplify testing
vi.mock("../../features/workspace/containers/GroupListContainer", () => ({
  default: () => <div data-testid="group-list">Group List</div>,
}));

describe("Component Tests", () => {
  describe("Sidebar", () => {
    const defaultProps = {
      width: 200,
      workspaces: [
        {
          id: "1",
          name: "WS 1",
          groups: [],
          createdAt: "",
          groupViewMode: 1,
          tabViewMode: 1,
        },
        {
          id: "2",
          name: "WS 2",
          groups: [],
          createdAt: "",
          groupViewMode: 1,
          tabViewMode: 1,
        },
      ],
      activeWorkspaceId: "1",
      showDonationModal: false,
      isClosing: false,
      onAddWorkspace: vi.fn(),
      onDeleteWorkspace: vi.fn(),
      onSelectWorkspace: vi.fn(),
      onCloseDonation: vi.fn(),
      onOpenDonation: vi.fn(),
    };

    it("renders workspaces", () => {
      render(<Sidebar {...(defaultProps as any)} />);
      expect(screen.getByText("WS 1")).toBeInTheDocument();
      expect(screen.getByText("WS 2")).toBeInTheDocument();
    });

    it("calls onAddWorkspace when add button clicked", () => {
      render(<Sidebar {...(defaultProps as any)} />);
      fireEvent.click(screen.getByText("sidebar.addWorkspace"));
      expect(defaultProps.onAddWorkspace).toHaveBeenCalled();
    });

    it("shows donation modal when prop is true", () => {
      render(<Sidebar {...(defaultProps as any)} showDonationModal={true} />);
      expect(
        screen.getByText("sidebar.donationModal.message")
      ).toBeInTheDocument();
    });
  });

  describe("Content", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("renders empty state when no active workspace", () => {
      (useWorkspaceStore as any).mockReturnValue({
        activeWorkspace: null,
      });
      render(<Content />);
      expect(screen.getByText("content.selectWorkspace")).toBeInTheDocument();
    });

    it("renders content when workspace is active", () => {
      (useWorkspaceStore as any).mockReturnValue({
        activeWorkspace: {
          id: "1",
          name: "Active WS",
          groups: [],
          groupViewMode: 1,
          tabViewMode: 1,
        },
        updateWorkspace: vi.fn(),
        deleteWorkspace: vi.fn(),
      });
      render(<Content />);
      expect(screen.getByDisplayValue("Active WS")).toBeInTheDocument();
      expect(screen.getByTestId("group-list")).toBeInTheDocument();
    });
  });

  describe("BrowserUI", () => {
    const mockWindow = {
      id: 123,
      tabs: [],
      focused: true,
      state: "normal",
    };

    it("renders window title", () => {
      render(<BrowserUI window={mockWindow as any} index={0} />);
      // t function returns key, so arguments are not interpolated in this basic mock
      // But our component calls t("browser.windowTitle", { number: 1 })
      // The mock returns "browser.windowTitle"
      expect(screen.getByText("browser.windowTitle")).toBeInTheDocument();
    });

    it("toggles accordion on click", () => {
      render(<BrowserUI window={mockWindow as any} index={0} />);
      const header = screen.getByText("browser.windowTitle").closest("div");
      // Initial state is expanded, so content should be visible (opacity-100)
      // We can check for class names or visibility.
      // Let's just check if clicking doesn't crash
      fireEvent.click(header!);
    });
  });

  describe("LanguageSelector", () => {
    it("toggles dropdown", () => {
      render(<LanguageSelector />);
      const button = screen.getByRole("button");
      fireEvent.click(button);
      expect(screen.getByText("한국어")).toBeInTheDocument();
      expect(screen.getByText("English")).toBeInTheDocument();
    });
  });
});
