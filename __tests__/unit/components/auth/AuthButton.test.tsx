import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AuthButton from "@/components/login/AuthButton";
import { User } from "@supabase/supabase-js";

const mockPush = jest.fn();
const mockRefresh = jest.fn();
const mockSignOut = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

jest.mock("@/lib/utils/supabase/client", () => ({
  createClient: () => ({
    auth: {
      signOut: mockSignOut,
    },
  }),
}));

describe("AuthButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSignOut.mockResolvedValue({});
  });

  const mockUser: User = {
    id: "user-123",
    email: "test@example.com",
    app_metadata: {},
    user_metadata: {},
    aud: "authenticated",
    created_at: "2024-01-01",
  } as User;

  it("renders sign in button when no user", () => {
    render(<AuthButton user={null} />);
    
    expect(screen.getByText("Sign In")).toBeInTheDocument();
  });

  it("navigates to login when clicking sign in", () => {
    render(<AuthButton user={null} />);
    
    fireEvent.click(screen.getByText("Sign In"));
    expect(mockPush).toHaveBeenCalledWith("/login");
  });

  it("renders user email when logged in", () => {
    render(<AuthButton user={mockUser} />);
    
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });

  it("renders logout button when logged in", () => {
    render(<AuthButton user={mockUser} />);
    
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("calls signOut and redirects on logout", async () => {
    render(<AuthButton user={mockUser} />);
    
    fireEvent.click(screen.getByText("Logout"));
    
    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/login");
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it("shows loading state during logout", async () => {
    mockSignOut.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );
    
    render(<AuthButton user={mockUser} />);
    
    fireEvent.click(screen.getByText("Logout"));
    
    // Button should be disabled during loading
    const logoutButton = screen.getByRole("button", { name: /logout/i });
    expect(logoutButton).toBeDisabled();
  });
});