import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import Dashboard from "../../pages/user/Dashboard";

// Mock Layout to avoid rendering full layout
jest.mock("../../components/Layout", () => ({ children }) => (
  <div data-testid="layout">{children}</div>
));

// Mock UserMenu
jest.mock("../../components/UserMenu", () => () => (
  <div data-testid="user-menu"></div>
));

// Mock useAuth hook
jest.mock("../../context/auth", () => ({
  useAuth: jest.fn(() => [
    {
      user: {
        name: "Test User",
        email: "test@example.com",
        address: "123 Test Street",
      },
    },
  ]),
}));

describe("Dashboard Component", () => {
  it("renders Dashboard correctly with user details", () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // Check if Layout is rendered
    expect(screen.getByTestId("layout")).toBeInTheDocument();

    // Check if UserMenu is rendered
    expect(screen.getByTestId("user-menu")).toBeInTheDocument();

    // Verify user details
    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
    expect(screen.getByText("123 Test Street")).toBeInTheDocument();
  });
});
