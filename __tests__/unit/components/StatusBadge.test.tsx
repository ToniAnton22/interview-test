import { render, screen } from "@testing-library/react";
import StatusBadge from "@/components/StatusBadge";
import { ProjectStatus } from "@/types/project";

describe("StatusBadge", () => {
  it("renders active status correctly", () => {
    render(<StatusBadge status={ProjectStatus.ACTIVE} />);
    
    const badge = screen.getByText("Active");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-green-100", "text-green-800");
  });

  it("renders on_hold status correctly", () => {
    render(<StatusBadge status={ProjectStatus.ON_HOLD} />);
    
    const badge = screen.getByText("On Hold");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-yellow-100", "text-yellow-800");
  });

  it("renders completed status correctly", () => {
    render(<StatusBadge status={ProjectStatus.COMPLETED} />);
    
    const badge = screen.getByText("Completed");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-blue-100", "text-blue-800");
  });

  it("has correct base styling", () => {
    render(<StatusBadge status={ProjectStatus.ACTIVE} />);
    
    const badge = screen.getByText("Active");
    expect(badge).toHaveClass("rounded-full", "text-xs", "font-medium");
  });
});