import { render, screen, fireEvent } from "@testing-library/react";
import FilterBar from "@/components/FilterBar";
import { ProjectStatusFilter } from "@/types/project";

describe("FilterBar", () => {
  const ownersMock = [
    { id: "user-1", name: "Alice" },
    { id: "user-2", name: "Bob" },
  ];

  const defaultProps = {
    search: "",
    onSearchChange: jest.fn(),
    status: ProjectStatusFilter.ALL,
    onStatusChange: jest.fn(),

    assignee: "",
    owners: ownersMock,
    onAssigneeChange: jest.fn(),

    onAddClick: jest.fn(),
  };

  const getStatusSelect = () => screen.getAllByRole("combobox")[0];
  const getOwnerSelect = () => screen.getAllByRole("combobox")[1];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders search input", () => {
    render(<FilterBar {...defaultProps} />);

    expect(
      screen.getByPlaceholderText("Search projects..."),
    ).toBeInTheDocument();
  });

  it("renders status dropdown with all options", () => {
    render(<FilterBar {...defaultProps} />);

    const statusSelect = getStatusSelect();
    expect(statusSelect).toBeInTheDocument();

    expect(screen.getByText("All Status")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("On Hold")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("renders owner dropdown with all owners", () => {
    render(<FilterBar {...defaultProps} />);

    const ownerSelect = getOwnerSelect();
    expect(ownerSelect).toBeInTheDocument();

    expect(screen.getByText("All Owners")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("renders add project button", () => {
    render(<FilterBar {...defaultProps} />);

    expect(screen.getByText("Add Project")).toBeInTheDocument();
  });

  it("calls onSearchChange when typing in search", () => {
    render(<FilterBar {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText("Search projects...");
    fireEvent.change(searchInput, { target: { value: "test" } });

    expect(defaultProps.onSearchChange).toHaveBeenCalledWith("test");
  });

  it("calls onStatusChange when selecting status", () => {
    render(<FilterBar {...defaultProps} />);

    const statusSelect = getStatusSelect();
    fireEvent.change(statusSelect, { target: { value: "active" } });

    expect(defaultProps.onStatusChange).toHaveBeenCalledWith("active");
  });

  it("calls onAssigneeChange when selecting owner", () => {
    render(<FilterBar {...defaultProps} />);

    const ownerSelect = getOwnerSelect();
    fireEvent.change(ownerSelect, { target: { value: "user-2" } });

    expect(defaultProps.onAssigneeChange).toHaveBeenCalledWith("user-2");
  });

  it("calls onAddClick when clicking add button", () => {
    render(<FilterBar {...defaultProps} />);

    const addButton = screen.getByText("Add Project");
    fireEvent.click(addButton);

    expect(defaultProps.onAddClick).toHaveBeenCalled();
  });

  it("displays current search value", () => {
    render(<FilterBar {...defaultProps} search="existing search" />);

    const searchInput = screen.getByPlaceholderText("Search projects...");
    expect(searchInput).toHaveValue("existing search");
  });

  it("displays current status value", () => {
    render(<FilterBar {...defaultProps} status={ProjectStatusFilter.ACTIVE} />);

    const statusSelect = getStatusSelect();
    expect(statusSelect).toHaveValue("active");
  });

  it("displays current assignee value", () => {
    render(<FilterBar {...defaultProps} assignee="user-1" />);

    const ownerSelect = getOwnerSelect();
    expect(ownerSelect).toHaveValue("user-1");
  });
});
