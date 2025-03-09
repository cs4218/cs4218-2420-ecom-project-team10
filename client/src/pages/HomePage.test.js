import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HomePage from "./HomePage";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import '@testing-library/jest-dom/extend-expect';
import axios from "axios";
import toast from "react-hot-toast";

jest.mock("axios");
jest.mock("react-hot-toast");

jest.mock("../context/auth", () => ({
  useAuth: jest.fn(() => [null, jest.fn()]), // Mock useAuth hook
}));

jest.mock("../context/cart", () => ({
  useCart: jest.fn(() => [[], jest.fn()]), // Mock useCart hook
}));

jest.mock("../context/search", () => ({
  useSearch: jest.fn(() => [{ keyword: "" }, jest.fn()]), // Mock useSearch hook
}));

jest.mock("../hooks/useCategory", () => jest.fn(() => []));



Object.defineProperty(window, 'localStorage', {
  value: {
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true,
});

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("HomePage Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });


  it('renders HomePage', () => {
    const {getByText} = render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </MemoryRouter>
    );
    expect(getByText('All Products')).toBeInTheDocument(); // Adjust to match actual text or element in HomePage
  });

  it("fetches categories and renders checkboxes", async () => {
    // Mock axios.get to return categories
    axios.get.mockResolvedValueOnce({
      data: {
        success: true,
        category: [
          { _id: "1", name: "Electronics" },
          { _id: "2", name: "Book" },
          { _id: "3", name: "Clothing" },
        ],
      },
    });

    // Render the HomePage component with MemoryRouter and Routes
    const { getByText, getByLabelText } = render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for categories to be rendered
    await waitFor(() => expect(getByText("Electronics")).toBeInTheDocument());
    await waitFor(() => expect(getByText("Book")).toBeInTheDocument());
    await waitFor(() => expect(getByText("Clothing")).toBeInTheDocument());

    // Check that checkboxes for categories are rendered
    expect(getByLabelText("Electronics")).toBeInTheDocument();
    expect(getByLabelText("Book")).toBeInTheDocument();
    expect(getByLabelText("Clothing")).toBeInTheDocument();
  });

});

