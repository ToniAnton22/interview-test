import { AlertContainer } from "@/components/Alert";
import { AlertMessage } from "@/lib/utils/types/Alert";
import { render, screen, fireEvent, act } from "@testing-library/react";

describe("AlertContainer", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders nothing when alerts array is empty", () => {
    const { container } = render(
      <AlertContainer alerts={[]} onDismiss={jest.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders success alert with correct styling", () => {
    const alerts: AlertMessage[] = [
      { id: "1", type: "success", message: "Operation successful!" },
    ];

    render(<AlertContainer alerts={alerts} onDismiss={jest.fn()} />);

    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent("Operation successful!");
    expect(alert).toHaveClass("bg-green-50", "border-green-200", "text-green-800");
  });

  it("renders error alert with correct styling", () => {
    const alerts: AlertMessage[] = [
      { id: "1", type: "error", message: "Something went wrong!" },
    ];

    render(<AlertContainer alerts={alerts} onDismiss={jest.fn()} />);

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Something went wrong!");
    expect(alert).toHaveClass("bg-red-50", "border-red-200", "text-red-800");
  });

  it("renders info alert with correct styling", () => {
    const alerts: AlertMessage[] = [
      { id: "1", type: "info", message: "Here is some information." },
    ];

    render(<AlertContainer alerts={alerts} onDismiss={jest.fn()} />);

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Here is some information.");
    expect(alert).toHaveClass("bg-blue-50", "border-blue-200", "text-blue-800");
  });

  it("renders multiple alerts", () => {
    const alerts: AlertMessage[] = [
      { id: "1", type: "success", message: "First alert" },
      { id: "2", type: "error", message: "Second alert" },
      { id: "3", type: "info", message: "Third alert" },
    ];

    render(<AlertContainer alerts={alerts} onDismiss={jest.fn()} />);

    const allAlerts = screen.getAllByRole("alert");
    expect(allAlerts).toHaveLength(3);
    expect(screen.getByText("First alert")).toBeInTheDocument();
    expect(screen.getByText("Second alert")).toBeInTheDocument();
    expect(screen.getByText("Third alert")).toBeInTheDocument();
  });

  it("calls onDismiss when X button is clicked", () => {
    const mockDismiss = jest.fn();
    const alerts: AlertMessage[] = [
      { id: "alert-1", type: "success", message: "Dismissable alert" },
    ];

    render(<AlertContainer alerts={alerts} onDismiss={mockDismiss} />);

    const dismissButton = screen.getByLabelText("Dismiss");
    fireEvent.click(dismissButton);

    expect(mockDismiss).toHaveBeenCalledWith("alert-1");
  });

  it("auto-dismisses after 5 seconds", () => {
    const mockDismiss = jest.fn();
    const alerts: AlertMessage[] = [
      { id: "auto-dismiss", type: "info", message: "Auto dismiss test" },
    ];

    render(<AlertContainer alerts={alerts} onDismiss={mockDismiss} />);

    expect(mockDismiss).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(mockDismiss).toHaveBeenCalledWith("auto-dismiss");
  });

  it("does not auto-dismiss before 5 seconds", () => {
    const mockDismiss = jest.fn();
    const alerts: AlertMessage[] = [
      { id: "wait", type: "success", message: "Waiting..." },
    ];

    render(<AlertContainer alerts={alerts} onDismiss={mockDismiss} />);

    act(() => {
      jest.advanceTimersByTime(4999);
    });

    expect(mockDismiss).not.toHaveBeenCalled();
  });

  it("clears timeout on unmount", () => {
    const mockDismiss = jest.fn();
    const alerts: AlertMessage[] = [
      { id: "unmount", type: "error", message: "Will unmount" },
    ];

    const { unmount } = render(
      <AlertContainer alerts={alerts} onDismiss={mockDismiss} />
    );

    unmount();

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    // Should not have been called after unmount
    expect(mockDismiss).not.toHaveBeenCalled();
  });

  it("has correct container positioning", () => {
    const alerts: AlertMessage[] = [
      { id: "1", type: "success", message: "Test" },
    ];

    render(<AlertContainer alerts={alerts} onDismiss={jest.fn()} />);

    const container = screen.getByRole("alert").parentElement;
    expect(container).toHaveClass("fixed", "top-4", "right-4", "z-50");
  });

  it("renders dismiss button with correct aria-label", () => {
    const alerts: AlertMessage[] = [
      { id: "1", type: "success", message: "Accessible alert" },
    ];

    render(<AlertContainer alerts={alerts} onDismiss={jest.fn()} />);

    const dismissButton = screen.getByRole("button", { name: "Dismiss" });
    expect(dismissButton).toBeInTheDocument();
  });

  it("has animation class for slide-in effect", () => {
    const alerts: AlertMessage[] = [
      { id: "1", type: "info", message: "Animated alert" },
    ];

    render(<AlertContainer alerts={alerts} onDismiss={jest.fn()} />);

    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("animate-slide-in");
  });
});