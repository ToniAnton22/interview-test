import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProjectModal from "@/components/ProjectModal/ProjectModal";
import { Project, ProjectStatus } from "@/types/project";

describe("ProjectModal", () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onSave: mockOnSave,
    project: null,
  };

  const mockProject: Project = {
    id: "123",
    name: "Test Project",
    description: "Test description",
    status: ProjectStatus.ACTIVE,
    deadline: "2024-12-31",
    assigned_to: "user-123",
    budget: 10000,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders nothing when closed", () => {
    const { container } = render(
      <ProjectModal {...defaultProps} isOpen={false} />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders modal when open", () => {
    render(<ProjectModal {...defaultProps} />);

    expect(screen.getByText("Add New Project")).toBeInTheDocument();
  });

  it("shows edit title when editing", () => {
    render(<ProjectModal {...defaultProps} project={mockProject} />);

    expect(screen.getByText("Edit Project")).toBeInTheDocument();
  });

  it("pre-fills form when editing", () => {
    render(<ProjectModal {...defaultProps} project={mockProject} />);

    expect(screen.getByDisplayValue("Test Project")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test description")).toBeInTheDocument();
    expect(screen.getByDisplayValue("10000")).toBeInTheDocument();
  });

  it("calls onClose when clicking cancel", () => {
    render(<ProjectModal {...defaultProps} />);

    fireEvent.click(screen.getByText("Cancel"));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("calls onClose when clicking X button", () => {
    render(<ProjectModal {...defaultProps} />);

    fireEvent.click(screen.getByLabelText("Close"));
    expect(mockOnClose).toHaveBeenCalled();
  });
  
  it("shows validation errors for required fields", async () => {
    render(<ProjectModal {...defaultProps} />);

    fireEvent.click(screen.getByText("Create"));

    await waitFor(() => {
      expect(screen.getByText("Project name is required")).toBeInTheDocument();
      expect(screen.getByText("Deadline is required")).toBeInTheDocument();
    });
  });

  it("calls onSave with form data on valid submit", async () => {
    const user = userEvent.setup();
    mockOnSave.mockResolvedValue(undefined);

    render(<ProjectModal {...defaultProps} />);

    await user.type(screen.getByLabelText(/Project Name/), "New Project");
    await user.type(screen.getByLabelText(/Deadline/), "2024-12-31");
    await user.type(screen.getByLabelText(/Budget/), "5000");

    fireEvent.click(screen.getByText("Create"));

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "New Project",
          deadline: "2024-12-31",
          budget: 5000,
        }),
      );
    });
  });

  it("shows loading state while saving", async () => {
    mockOnSave.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100)),
    );

    const user = userEvent.setup();
    render(<ProjectModal {...defaultProps} />);

    await user.type(screen.getByLabelText(/Project Name/), "New Project");
    await user.type(screen.getByLabelText(/Deadline/), "2024-12-31");

    fireEvent.click(screen.getByText("Create"));

    await waitFor(() => {
      expect(screen.getByText("Saving...")).toBeInTheDocument();
    });
  });

  it("clears form on close and reopen for new project", () => {
    const { rerender } = render(
      <ProjectModal {...defaultProps} project={mockProject} />,
    );

    expect(screen.getByDisplayValue("Test Project")).toBeInTheDocument();

    rerender(<ProjectModal {...defaultProps} isOpen={false} project={null} />);
    rerender(<ProjectModal {...defaultProps} isOpen={true} project={null} />);

    expect(screen.queryByDisplayValue("Test Project")).not.toBeInTheDocument();
  });
});
