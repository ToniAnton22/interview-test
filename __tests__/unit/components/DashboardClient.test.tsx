// __tests__/pages/DashboardPage.test.tsx
import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import DashboardPage from "@/app/dashboard/page"; // adjust if your path differs
import { ProjectStatus } from "@/types/project";

// --- mock child components so we're testing the page wiring, not their internals ---
jest.mock("@/components/FilterBar", () => ({
  __esModule: true,
  default: (props: any) => (
    <div data-testid="FilterBar">
      <div>search:{props.search}</div>
      <div>status:{props.status}</div>

      <button onClick={() => props.onSearchChange("hello")}>set-search</button>
      <button onClick={() => props.onStatusChange(ProjectStatus.ACTIVE)}>
        set-status-active
      </button>
      <button onClick={props.onAddClick}>add</button>
    </div>
  ),
}));

jest.mock("@/components/ProjectTable", () => ({
  __esModule: true,
  default: (props: any) => (
    <div data-testid="ProjectTable">
      <div>rows:{props.projects?.length ?? 0}</div>
      <div>loading:{String(!!props.isLoading)}</div>
      <button onClick={() => props.onEdit(props.projects[0])}>
        edit-first
      </button>
      <button onClick={() => props.onDelete(props.projects[0])}>
        delete-first
      </button>
    </div>
  ),
}));

jest.mock("@/components/Pagination", () => ({
  __esModule: true,
  default: (props: any) => (
    <div data-testid="Pagination">
      <div>
        page:{props.pagination.page} / total:{props.pagination.total}
      </div>
      <button onClick={() => props.onPageChange(2)}>go-page-2</button>
    </div>
  ),
}));

jest.mock("@/components/ProjectModal/ProjectModal", () => ({
  __esModule: true,
  default: (props: any) => (
    <div data-testid="ProjectModal">
      <div>open:{String(!!props.isOpen)}</div>
      <div>project:{props.project?.id ?? "none"}</div>
      <button onClick={() => props.onClose()}>close-modal</button>
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
      <button onClick={() => props.onClose()}>close-delete</button>
      <button onClick={() => props.onConfirm()}>confirm-delete</button>
    </div>
  ),
}));

// --- mock provider hook ---
const mockUseProjects = jest.fn();
jest.mock("@/lib/providers/ProjectsProvider", () => ({
  __esModule: true,
  useProjects: () => mockUseProjects(),
}));

describe("DashboardPage", () => {
  const baseProjects = [
    {
      id: "1",
      name: "Alpha",
      description: "x",
      status: ProjectStatus.ACTIVE,
      deadline: "2024-12-31",
      assigned_to: "u1",
      budget: 1000,
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    },
  ];

  const baseState = {
    projects: baseProjects,
    isLoading: false,
    currentUserId: "u1",
    search: "",
    statusFilter: "all",
    pagination: { page: 1, pageSize: 10, total: 1, totalPages: 1 },

    editingProject: null,
    deletingProject: null,
    isDeleting: false,
    isModalOpen: false,

    setSearch: jest.fn(),
    setStatusFilter: jest.fn(),
    handlePageChange: jest.fn(),

    handleCreate: jest.fn().mockResolvedValue(undefined),
    handleUpdate: jest.fn().mockResolvedValue(undefined),
    handleDelete: jest.fn().mockResolvedValue(undefined),

    openAddModal: jest.fn(),
    openEditModal: jest.fn(),
    closeModal: jest.fn(),
    setDeletingProject: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseProjects.mockReturnValue({ ...baseState });
  });

  it("renders header and count", () => {
    render(<DashboardPage />);

    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("1 project")).toBeInTheDocument();
  });

  it("passes state into FilterBar, ProjectTable, Pagination", () => {
    render(<DashboardPage />);

    expect(screen.getByTestId("FilterBar")).toBeInTheDocument();
    expect(screen.getByTestId("ProjectTable")).toBeInTheDocument();
    expect(screen.getByTestId("Pagination")).toBeInTheDocument();

    // scope checks to ProjectTable
    const table = within(screen.getByTestId("ProjectTable"));
    expect(table.getByText("rows:1")).toBeInTheDocument();
    expect(table.getByText("loading:false")).toBeInTheDocument();

    // scope checks to Pagination
    const pager = within(screen.getByTestId("Pagination"));
    expect(pager.getByText("page:1 / total:1")).toBeInTheDocument();
  });

  it("wires FilterBar callbacks to provider actions", () => {
    render(<DashboardPage />);

    fireEvent.click(screen.getByText("set-search"));
    expect(baseState.setSearch).toHaveBeenCalledWith("hello");

    fireEvent.click(screen.getByText("set-status-active"));
    expect(baseState.setStatusFilter).toHaveBeenCalledWith(
      ProjectStatus.ACTIVE,
    );

    fireEvent.click(screen.getByText("add"));
    expect(baseState.openAddModal).toHaveBeenCalled();
  });

  it("wires ProjectTable edit/delete to provider actions", () => {
    render(<DashboardPage />);

    fireEvent.click(screen.getByText("edit-first"));
    expect(baseState.openEditModal).toHaveBeenCalledWith(baseProjects[0]);

    fireEvent.click(screen.getByText("delete-first"));
    expect(baseState.setDeletingProject).toHaveBeenCalledWith(baseProjects[0]);
  });

  it("wires Pagination onPageChange", () => {
    render(<DashboardPage />);

    fireEvent.click(screen.getByText("go-page-2"));
    expect(baseState.handlePageChange).toHaveBeenCalledWith(2);
  });

  it("ProjectModal uses handleCreate when not editing", async () => {
    render(<DashboardPage />);

    fireEvent.click(screen.getByText("save-modal"));
    expect(baseState.handleCreate).toHaveBeenCalledWith({ name: "X" });
    expect(baseState.handleUpdate).not.toHaveBeenCalled();
  });

  it("ProjectModal uses handleUpdate when editing", () => {
    mockUseProjects.mockReturnValue({
      ...baseState,
      editingProject: baseProjects[0],
      isModalOpen: true,
    });

    render(<DashboardPage />);

    expect(screen.getByText("open:true")).toBeInTheDocument();
    expect(screen.getByText("project:1")).toBeInTheDocument();

    fireEvent.click(screen.getByText("save-modal"));
    expect(baseState.handleUpdate).toHaveBeenCalledWith({ name: "X" });
    expect(baseState.handleCreate).not.toHaveBeenCalled();
  });

  it("DeleteConfirmModal opens when deletingProject exists and wires close/confirm", () => {
    mockUseProjects.mockReturnValue({
      ...baseState,
      deletingProject: baseProjects[0],
      isDeleting: true,
    });

    render(<DashboardPage />);

    expect(screen.getByTestId("DeleteConfirmModal")).toBeInTheDocument();
    expect(screen.getByText("open:true")).toBeInTheDocument();
    expect(screen.getByText("project:1")).toBeInTheDocument();
    expect(screen.getByText("loading:true")).toBeInTheDocument();

    fireEvent.click(screen.getByText("close-delete"));
    expect(baseState.setDeletingProject).toHaveBeenCalledWith(null);

    fireEvent.click(screen.getByText("confirm-delete"));
    expect(baseState.handleDelete).toHaveBeenCalled();
  });
});
