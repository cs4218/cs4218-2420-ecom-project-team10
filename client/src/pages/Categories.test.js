import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HomePage from "./HomePage"; // Adjust this path
import axios from "axios";
import { useCart } from "../context/cart";

// Mock necessary modules
jest.mock("axios");
jest.mock("../context/cart");

describe("HomePage - Reset Filters", () => {
  const mockProducts = [
    { _id: "1", name: "Product 1", price: 100, description: "Description 1" },
    { _id: "2", name: "Product 2", price: 200, description: "Description 2" },
  ];

  const mockCategories = [
    { _id: "1", name: "Category 1" },
    { _id: "2", name: "Category 2" },
  ];

  beforeEach(() => {
    // Mocking the cart context
    useCart.mockReturnValue([[], jest.fn()]);

    // Mocking API responses
    axios.get.mockResolvedValueOnce({
      data: { success: true, category: mockCategories }, // Mock category data
    }).mockResolvedValueOnce({
      data: { products: mockProducts }, // Mock product data
    }).mockResolvedValueOnce({
      data: { total: 2 }, // Mock total count
    });
  });

  test("should reset filters when 'RESET FILTERS' button is clicked", async () => {
    // Render the HomePage component
    render(<HomePage />);

    // Wait for categories to be loaded and check if categories are rendered
    await waitFor(() => screen.findByText("Filter By Category"));
    expect(screen.getByText("Category 1")).toBeInTheDocument();
    expect(screen.getByText("Category 2")).toBeInTheDocument();

    // Wait for the products to load
    expect(screen.getByText("Product 1")).toBeInTheDocument();
    expect(screen.getByText("Product 2")).toBeInTheDocument();

    // Select a category filter
    fireEvent.click(screen.getByLabelText("Category 1"));

    // Simulate clicking the 'RESET FILTERS' button
    fireEvent.click(screen.getByText("RESET FILTERS"));

    // Verify that the checkboxes for categories are unchecked (filters are reset)
    await waitFor(() => expect(screen.getByLabelText("Category 1")).not.toBeChecked());
    await waitFor(() => expect(screen.getByLabelText("Category 2")).not.toBeChecked());

    // Verify that the `getAllProducts` API was called to fetch all products (without filters)
    await waitFor(() => {
      expect(screen.getByText("Product 1")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("Product 2")).toBeInTheDocument();
    });
  });
});
