import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { Project, ProjectStatus } from "@/types/project";

describe("DeleteConfirmModal", () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();

  const mockProject: Project = {
    id: "123",
    name: "Project to Delete",
    description: "Test description",
    status: ProjectStatus.ACTIVE,
    deadline: "2024-12-31",
    assigned_to: "user-123",
    budget: 10000,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  };

  const defaultProps = {
    isOpen: true,
    project: mockProject,
    onClose: mockOnClose,
    onConfirm: mockOnConfirm,
    isLoading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders nothing when closed", () => {
    const { container } = render(
      <DeleteConfirmModal {...defaultProps} isOpen={false} />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when no project", () => {
    const { container } = render(
      <DeleteConfirmModal {...defaultProps} project={null} />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("displays project name in confirmation message", () => {
    render(<DeleteConfirmModal {...defaultProps} />);

    expect(screen.getByText("Project to Delete")).toBeInTheDocument();
  });

  it("displays delete warning message", () => {
    render(<DeleteConfirmModal {...defaultProps} />);

    expect(
      screen.getByText(/This action cannot be undone/),
    ).toBeInTheDocument();
  });

  it("calls onClose when clicking cancel", () => {
    render(<DeleteConfirmModal {...defaultProps} />);

    fireEvent.click(screen.getByText("Cancel"));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("calls onConfirm when clicking delete", () => {
    render(<DeleteConfirmModal {...defaultProps} />);

    fireEvent.click(screen.getByText("Delete"));
    expect(mockOnConfirm).toHaveBeenCalled();
  });

  it("shows loading state", () => {
    render(<DeleteConfirmModal {...defaultProps} isLoading={true} />);

    expect(screen.getByText("Deleting...")).toBeInTheDocument();
  });

  it("disables buttons while loading", () => {
    render(<DeleteConfirmModal {...defaultProps} isLoading={true} />);

    expect(screen.getByText("Cancel")).toBeDisabled();
    expect(screen.getByText("Deleting...")).toBeDisabled();
  });

  it("closes when clicking backdrop", () => {
    render(<DeleteConfirmModal {...defaultProps} />);

    // Find the backdrop (the fixed overlay div)
    const backdrop = document.querySelector(".fixed.inset-0.bg-black");
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(mockOnClose).toHaveBeenCalled();
    }
  });
});
