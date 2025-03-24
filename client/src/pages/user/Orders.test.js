import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import Orders from "../../pages/user/Orders";
import axios from "axios";
import moment from "moment";

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
      token: "test-token",
      user: { name: "Test User" },
    },
  ]),
}));

// Mock axios get request
jest.mock("axios");

describe("Orders Component", () => {
  const mockOrders = [
    {
      _id: "1",
      status: "Delivered",
      buyer: { name: "Alice" },
      createAt: "2024-03-20T12:00:00Z",
      payment: { success: true },
      products: [
        { _id: "p1", name: "Product A", description: "Great product", price: 100 },
        { _id: "p2", name: "Product B", description: "Another item", price: 200 },
      ],
    },
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockOrders });

    // Mock moment to always return a static relative time
    jest.spyOn(moment.prototype, "fromNow").mockReturnValue("2 days ago");
  });

  it("renders Orders page correctly", async () => {
    render(
      <MemoryRouter>
        <Orders />
      </MemoryRouter>
    );

    // Check if Layout and UserMenu are rendered
    expect(screen.getByTestId("layout")).toBeInTheDocument();
    expect(screen.getByTestId("user-menu")).toBeInTheDocument();

    // Wait for orders to load
    await waitFor(() => {
      expect(screen.getByText("All Orders")).toBeInTheDocument();
      expect(screen.getByText("Delivered")).toBeInTheDocument();
      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("2 days ago")).toBeInTheDocument();
      expect(screen.getByText("Success")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument(); // Quantity of products
    });

    // Verify product details
    expect(screen.getByText("Product A")).toBeInTheDocument();
    expect(screen.getByText("Great product")).toBeInTheDocument();
    expect(screen.getByText("Price : 100")).toBeInTheDocument();
    expect(screen.getByText("Product B")).toBeInTheDocument();
    expect(screen.getByText("Another item")).toBeInTheDocument();
    expect(screen.getByText("Price : 200")).toBeInTheDocument();
  });
});
