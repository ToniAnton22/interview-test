import { render, screen, fireEvent } from "@testing-library/react";
import FilterBar from "@/components/FilterBar";
import { ProjectStatusFilter } from "@/types/project";

describe("FilterBar", () => {
  const defaultProps = {
    search: "",
    onSearchChange: jest.fn(),
    status: ProjectStatusFilter.ALL,
    onStatusChange: jest.fn(),
    onAddClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders search input", () => {
    render(<FilterBar {...defaultProps} />);
    
    expect(screen.getByPlaceholderText("Search projects...")).toBeInTheDocument();
  });

  it("renders status dropdown with all options", () => {
    render(<FilterBar {...defaultProps} />);
    
    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
    
    expect(screen.getByText("All Status")).toBeInTheDocument();
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
    
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "active" } });
    
    expect(defaultProps.onStatusChange).toHaveBeenCalledWith("active");
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
    
    const select = screen.getByRole("combobox");
    expect(select).toHaveValue("active");
  });
});