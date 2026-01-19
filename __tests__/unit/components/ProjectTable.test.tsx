import { render, screen, fireEvent, within } from "@testing-library/react";
import ProjectTable from "@/components/ProjectTable";
import { ProjectStatus, ProjectView } from "@/types/project";
import { formatDate } from "@/lib/utils/formatters/formatDate";

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children, ...rest }: any) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

describe("ProjectTable", () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  const mockProjects: ProjectView[] = [
    {
      id: "1",
      name: "Project Alpha",
      description: "First project",
      status: ProjectStatus.ACTIVE,
      deadline: "2024-12-31",
      assigned_to: "user-1",
      budget: 10000,
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
      assigned_user: { id: "user-1", name: "Alice" },
    },
    {
      id: "2",
      name: "Project Beta",
      description: null,
      status: ProjectStatus.ON_HOLD,
      deadline: "2024-06-30",
      assigned_to: "user-2",
      budget: 5000,
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
      assigned_user: { id: "user-2", name: "Bob" },
    },
  ];

  const defaultProps = {
    projects: mockProjects,
    currentUserId: "user-1",
    onEdit: mockOnEdit,
    onDelete: mockOnDelete,
    isLoading: false,
  };

  const getDesktopTable = () => screen.getByRole("table");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state", () => {
    render(<ProjectTable {...defaultProps} isLoading />);
    expect(screen.getByText("Loading projects...")).toBeInTheDocument();
  });

  it("renders empty state when no projects", () => {
    render(<ProjectTable {...defaultProps} projects={[]} />);

    expect(screen.getByText("No projects found")).toBeInTheDocument();
    expect(screen.getByText(/Get started by creating/i)).toBeInTheDocument();
  });

  it("renders project names (desktop)", () => {
    render(<ProjectTable {...defaultProps} />);

    const t = within(getDesktopTable());
    expect(t.getByText("Project Alpha")).toBeInTheDocument();
    expect(t.getByText("Project Beta")).toBeInTheDocument();
  });

  it("renders project descriptions only when present (desktop)", () => {
    render(<ProjectTable {...defaultProps} />);

    const t = within(getDesktopTable());
    expect(t.getByText("First project")).toBeInTheDocument();
    expect(t.getAllByText("First project")).toHaveLength(1);
  });

  it("renders status badges", () => {
    render(<ProjectTable {...defaultProps} />);

    // both desktop & mobile are in DOM in tests, so count >= 1 is correct
    expect(screen.getAllByText("Active").length).toBeGreaterThan(0);
    expect(screen.getAllByText("On Hold").length).toBeGreaterThan(0);
  });

  it("formats budget correctly", () => {
    render(<ProjectTable {...defaultProps} />);

    expect(screen.getAllByText("$10,000").length).toBeGreaterThan(0);
    expect(screen.getAllByText("$5,000").length).toBeGreaterThan(0);
  });

  it("shows edit/delete icon buttons only for owned project (desktop)", () => {
    render(<ProjectTable {...defaultProps} />);

    const t = within(getDesktopTable());
    expect(t.getAllByTitle("Edit project")).toHaveLength(1);
    expect(t.getAllByTitle("Delete project")).toHaveLength(1);

    // Non-owned row shows View only in desktop actions cell
    expect(t.getAllByText("View only")).toHaveLength(1);
  });

  it("calls onEdit when clicking edit icon button (desktop)", () => {
    render(<ProjectTable {...defaultProps} />);

    const t = within(getDesktopTable());
    fireEvent.click(t.getByTitle("Edit project"));

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
    expect(mockOnEdit).toHaveBeenCalledWith(mockProjects[0]);
  });

  it("calls onDelete when clicking delete icon button (desktop)", () => {
    render(<ProjectTable {...defaultProps} />);

    const t = within(getDesktopTable());
    fireEvent.click(t.getByTitle("Delete project"));

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith(mockProjects[0]);
  });

  it("renders assigned user names (desktop and mobile)", () => {
    render(<ProjectTable {...defaultProps} />);

    const t = within(getDesktopTable());
    expect(t.getByText("Alice")).toBeInTheDocument();
    expect(t.getByText("Bob")).toBeInTheDocument();

    expect(screen.getAllByText("Alice").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Bob").length).toBeGreaterThan(0);
  });

  it("formats dates correctly (desktop)", () => {
    render(<ProjectTable {...defaultProps} />);

    const t = within(getDesktopTable());
    const expected = formatDate(mockProjects[0].deadline);
    expect(t.getByText(expected)).toBeInTheDocument();
  });

  it("renders Edit/Delete buttons for owned project (mobile section exists in DOM)", () => {
    render(<ProjectTable {...defaultProps} />);

    // In tests Tailwind doesn't hide desktop/mobile, so just assert they exist at least once
    expect(screen.getAllByRole("button", { name: "Edit" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: "Delete" }).length).toBeGreaterThan(0);
  });

  it("when no currentUserId, shows no edit/delete anywhere and desktop shows view-only for all rows", () => {
    render(<ProjectTable {...defaultProps} currentUserId={undefined} />);

    const t = within(getDesktopTable());
    expect(t.queryByTitle("Edit project")).not.toBeInTheDocument();
    expect(t.queryByTitle("Delete project")).not.toBeInTheDocument();
    expect(t.getAllByText("View only")).toHaveLength(2);

    // mobile buttons also absent
    expect(screen.queryByRole("button", { name: "Edit" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Delete" })).not.toBeInTheDocument();
  });

  it("renders links to project details (desktop and mobile)", () => {
    render(<ProjectTable {...defaultProps} />);

    // Desktop: name link and eye link both go to /dashboard/:id, plus mobile has "View"
    const links = screen.getAllByRole("link");
    expect(links.some((a) => (a as HTMLAnchorElement).getAttribute("href") === "/dashboard/1")).toBe(true);
    expect(links.some((a) => (a as HTMLAnchorElement).getAttribute("href") === "/dashboard/2")).toBe(true);
  });
});
