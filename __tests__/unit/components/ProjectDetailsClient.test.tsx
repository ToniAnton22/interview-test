// __tests__/pages/ProjectDetailsClient.test.tsx
import React from "react";
import {
  render,
  screen,
  fireEvent,
  within,
  waitFor,
} from "@testing-library/react";
import ProjectDetailsClient from "@/app/dashboard/[id]/_components/ProjectDetailsClient"; // <-- adjust path
import { ProjectStatus } from "@/types/project";

// ---- next/link mock ----
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children, ...rest }: any) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

// ---- router mock ----
const push = jest.fn();
const refresh = jest.fn();

jest.mock("next/navigation", () => ({
  __esModule: true,
  useRouter: () => ({ push, refresh }),
}));

// ---- formatters mock (avoid locale/timezone issues) ----
jest.mock("@/lib/utils/formatters/formatDate", () => ({
  __esModule: true,
  formatDate: (s: string) => `DATE(${s})`,
}));

jest.mock("@/lib/utils/formatters/formatBudget", () => ({
  __esModule: true,
  formatBudget: (n: number) => `BUDGET(${n})`,
}));

// ---- child components mock (keep tests focused) ----
jest.mock("@/components/StatusBadge", () => ({
  __esModule: true,
  default: ({ status }: any) => <span data-testid="StatusBadge">{status}</span>,
}));

jest.mock("@/components/ProjectModal/ProjectModal", () => ({
  __esModule: true,
  default: (props: any) => (
    <div data-testid="ProjectModal">
      <div>open:{String(!!props.isOpen)}</div>
      <div>project:{props.project?.id ?? "none"}</div>
      <button onClick={props.onClose}>close-modal</button>
      <button onClick={() => props.onSave({ name: "X" })}>save-modal</button>
    </div>
  ),
}));

jest.mock("@/components/DeleteConfirmModal", () => ({
  __esModule: true,
  default: (props: any) => (
    <div data-testid="DeleteConfirmModal">
      <div>open:{String(!!props.isOpen)}</div>
      <div>project:{props.project?.id ?? "none"}</div>
      <div>loading:{String(!!props.isLoading)}</div>
      <button onClick={props.onClose}>close-delete</button>
      <button onClick={props.onConfirm}>confirm-delete</button>
    </div>
  ),
}));

// ---- provider hook mock ----
const mockUseProjectDetails = jest.fn();
jest.mock("@/lib/providers/ProjectDetailsProvider", () => ({
  __esModule: true,
  ProjectDetailsProvider: ({ children }: any) => <>{children}</>,
  useProjectDetails: () => mockUseProjectDetails(),
}));

describe("ProjectDetailsClient", () => {
  const project = {
    id: "123",
    name: "Test Project",
    description: "Test description",
    status: ProjectStatus.ACTIVE,
    deadline: "2024-12-31",
    assigned_to: "user-1",
    budget: 10000,
    created_at: "2024-01-01",
    updated_at: "2024-01-02",
    assigned_user: { id: "user-1", name: "Alice" },
  };

  const baseState = {
    project,
    isLoading: false,
    currentUserId: "user-1",
    isModalOpen: false,
    openEditModal: jest.fn(),
    closeModal: jest.fn(),

    deletingProject: null as any,
    isDeleting: false,
    setDeletingProject: jest.fn(),

    handleUpdate: jest.fn().mockResolvedValue(undefined),
    handleDelete: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    push.mockClear();
    refresh.mockClear();
    mockUseProjectDetails.mockReturnValue({ ...baseState });
  });

  it("renders loading title and loading body when isLoading", () => {
    mockUseProjectDetails.mockReturnValue({
      ...baseState,
      isLoading: true,
      project: null,
    });

    render(<ProjectDetailsClient id="123" />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.getByText(/Loading project/i)).toBeInTheDocument();
  });

  it("renders not-found message when no project and not loading", () => {
    mockUseProjectDetails.mockReturnValue({
      ...baseState,
      project: null,
      isLoading: false,
    });

    render(<ProjectDetailsClient id="123" />);

    expect(screen.getByText("Project not found")).toBeInTheDocument();
    expect(
      screen.getByText(/We couldn’t find that project/i),
    ).toBeInTheDocument();
  });

  it("renders project details (status, assigned, deadline, budget, description, dates)", () => {
    render(<ProjectDetailsClient id="123" />);

    expect(screen.getByText("Test Project")).toBeInTheDocument();
    expect(screen.getByTestId("StatusBadge")).toHaveTextContent("active");
    expect(screen.getByText("Alice")).toBeInTheDocument();

    // formatters are mocked
    expect(screen.getByText("DATE(2024-12-31)")).toBeInTheDocument();
    expect(screen.getByText("BUDGET(10000)")).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();

    expect(screen.getByText("DATE(2024-01-01)")).toBeInTheDocument();
    expect(screen.getByText("DATE(2024-01-02)")).toBeInTheDocument();

    // back link
    const back = screen.getByText(/Back to Projects/i);
    expect(back).toHaveAttribute("href", "/dashboard");
  });

  it("shows Edit/Delete buttons only when current user owns the project", () => {
    // owner => visible
    const view = render(<ProjectDetailsClient id="123" />);
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();

    // update hook return for the next render
    mockUseProjectDetails.mockReturnValue({
      ...baseState,
      currentUserId: "someone-else",
    });

    view.rerender(<ProjectDetailsClient id="123" />);

    expect(
      screen.queryByRole("button", { name: "Edit" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Delete" }),
    ).not.toBeInTheDocument();
  });

  it("clicking Edit calls openEditModal", () => {
    render(<ProjectDetailsClient id="123" />);

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    expect(baseState.openEditModal).toHaveBeenCalled();
  });

  it("clicking Delete sets deletingProject", () => {
    render(<ProjectDetailsClient id="123" />);

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(baseState.setDeletingProject).toHaveBeenCalledWith(project);
  });

  it("confirm delete calls handleDelete then navigates to /dashboard and refreshes", async () => {
    mockUseProjectDetails.mockReturnValue({
      ...baseState,
      deletingProject: project,
    });

    render(<ProjectDetailsClient id="123" />);

    const del = within(screen.getByTestId("DeleteConfirmModal"));
    expect(del.getByText("open:true")).toBeInTheDocument();

    fireEvent.click(del.getByText("confirm-delete"));

    await waitFor(() => {
      expect(baseState.handleDelete).toHaveBeenCalled();
      expect(push).toHaveBeenCalledWith("/dashboard");
      expect(refresh).toHaveBeenCalled();
    });
  });

  it("wires ProjectModal props (open + close + save)", async () => {
    mockUseProjectDetails.mockReturnValue({
      ...baseState,
      isModalOpen: true,
    });

    render(<ProjectDetailsClient id="123" />);

    const modal = within(screen.getByTestId("ProjectModal"));
    expect(modal.getByText("open:true")).toBeInTheDocument();
    expect(modal.getByText("project:123")).toBeInTheDocument();

    fireEvent.click(modal.getByText("close-modal"));
    expect(baseState.closeModal).toHaveBeenCalled();

    fireEvent.click(modal.getByText("save-modal"));
    expect(baseState.handleUpdate).toHaveBeenCalledWith({ name: "X" });
  });

  it("close delete modal sets deletingProject(null)", () => {
    mockUseProjectDetails.mockReturnValue({
      ...baseState,
      deletingProject: project,
    });

    render(<ProjectDetailsClient id="123" />);

    const del = within(screen.getByTestId("DeleteConfirmModal"));
    fireEvent.click(del.getByText("close-delete"));
    expect(baseState.setDeletingProject).toHaveBeenCalledWith(null);
  });
});
