import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UpdateProduct from "./UpdateProduct";
import { MemoryRouter, useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer } from "react-hot-toast";

jest.mock("axios");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

describe("UpdateProduct Integration Tests", () => {
  const mockProduct = {
    product: {
      _id: "1",
      name: "Sample Product",
      description: "Sample Description",
      price: 100,
      quantity: 10,
      shipping: true,
      category: { _id: "123", name: "Electronics" },
    },
  };

  const mockCategories = {
    category: [
      { _id: "123", name: "Electronics" },
      { _id: "456", name: "Clothing" },
    ],
  };

  beforeEach(() => {
    useParams.mockReturnValue({ slug: "sample-product" });
    axios.get.mockImplementation((url) => {
      if (url.includes("get-product")) {
        return Promise.resolve({ data: mockProduct });
      } else if (url.includes("get-category")) {
        return Promise.resolve({ data: mockCategories });
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders product details on load", async () => {
    render(
      <MemoryRouter>
        <UpdateProduct />
        <ToastContainer />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue("Sample Product")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Sample Description")).toBeInTheDocument();
      expect(screen.getByDisplayValue("100")).toBeInTheDocument();
      expect(screen.getByDisplayValue("10")).toBeInTheDocument();
      expect(screen.getByText("Electronics")).toBeInTheDocument();
    });
  });

  test("updates product successfully", async () => {
    axios.put.mockResolvedValueOnce({ data: { success: true } });

    render(
      <MemoryRouter>
        <UpdateProduct />
        <ToastContainer />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByDisplayValue("Sample Product"));

    fireEvent.change(screen.getByPlaceholderText("write a name"), {
      target: { value: "Updated Product" },
    });

    fireEvent.click(screen.getByText("UPDATE PRODUCT"));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        "/api/v1/product/update-product/1",
        expect.any(FormData)
      );
    });
  });

  test("deletes product successfully", async () => {
    axios.delete.mockResolvedValueOnce({ data: { success: true } });
    window.prompt = jest.fn().mockReturnValue("Yes");

    render(
      <MemoryRouter>
        <UpdateProduct />
        <ToastContainer />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText("DELETE PRODUCT"));

    fireEvent.click(screen.getByText("DELETE PRODUCT"));

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        "/api/v1/product/delete-product/1"
      );
    });
  });

  test("handles update error", async () => {
    axios.put.mockRejectedValueOnce(new Error("Update failed"));

    render(
      <MemoryRouter>
        <UpdateProduct />
        <ToastContainer />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByDisplayValue("Sample Product"));

    fireEvent.click(screen.getByText("UPDATE PRODUCT"));

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });

  test("handles delete error", async () => {
    axios.delete.mockRejectedValueOnce(new Error("Delete failed"));
    window.prompt = jest.fn().mockReturnValue("Yes");

    render(
      <MemoryRouter>
        <UpdateProduct />
        <ToastContainer />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText("DELETE PRODUCT"));

    fireEvent.click(screen.getByText("DELETE PRODUCT"));

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });
});
