import { render, screen } from "@testing-library/react";
import Dashboard from "./Dashboard";
import { AuthContext } from "../../context/auth";

// Mock Layout and UserMenu components
jest.mock("../../components/Layout", () => ({ children }) => <div>{children}</div>);
jest.mock("../../components/UserMenu", () => () => <div>Mocked UserMenu</div>);

describe("Dashboard Component", () => {
  const mockUser = {
    name: "John Doe",
    email: "john.doe@example.com",
    address: "123 Main St"
  };

  test("renders user information correctly", () => {
    render(
      <AuthContext.Provider value={[{ user: mockUser }]}>
        <Dashboard />
      </AuthContext.Provider>
    );

    expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    expect(screen.getByText(/john.doe@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/123 main st/i)).toBeInTheDocument();
  });

  test("renders UserMenu component", () => {
    render(
      <AuthContext.Provider value={[{ user: mockUser }]}>
        <Dashboard />
      </AuthContext.Provider>
    );

    expect(screen.getByText(/Mocked UserMenu/i)).toBeInTheDocument();
  });
});
