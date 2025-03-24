import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import Profile from "../../pages/user/Profile";
import axios from "axios";
import toast from "react-hot-toast";

// Mock Layout and UserMenu components
jest.mock("../../components/Layout", () => ({ children }) => (
  <div data-testid="layout">{children}</div>
));
jest.mock("../../components/UserMenu", () => () => (
  <div data-testid="user-menu"></div>
));

// Mock useAuth hook
jest.mock("../../context/auth", () => ({
  useAuth: jest.fn(() => [
    {
      token: "test-token",
      user: {
        name: "John Doe",
        email: "john@example.com",
        phone: "1234567890",
        address: "123 Street, City",
      },
    },
    jest.fn(),
  ]),
}));

// Mock axios and toast
jest.mock("axios");
jest.mock("react-hot-toast", () => ({
  error: jest.fn(),
  success: jest.fn(),
}));

describe("Profile Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders Profile page correctly", () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    expect(screen.getByTestId("layout")).toBeInTheDocument();
    expect(screen.getByTestId("user-menu")).toBeInTheDocument();
    expect(screen.getByText("USER PROFILE")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter Your Name")).toHaveValue(
      "John Doe"
    );
    expect(screen.getByPlaceholderText("Enter Your Email ")).toHaveValue(
      "john@example.com"
    );
    expect(screen.getByPlaceholderText("Enter Your Email ")).toBeDisabled();
    expect(screen.getByPlaceholderText("Enter Your Phone")).toHaveValue(
      "1234567890"
    );
    expect(screen.getByPlaceholderText("Enter Your Address")).toHaveValue(
      "123 Street, City"
    );
  });

  it("shows validation errors when fields are empty", async () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Enter Your Name"), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter Your Phone"), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter Your Address"), {
      target: { value: "" },
    });

    fireEvent.click(screen.getByText("UPDATE"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Name is required", expect.any(Object));
      expect(toast.error).toHaveBeenCalledWith("Phone number is required", expect.any(Object));
      expect(toast.error).toHaveBeenCalledWith("Address is required", expect.any(Object));
    });
  });

  it("shows validation error for short password", async () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Enter Your Password"), {
      target: { value: "123" },
    });

    fireEvent.click(screen.getByText("UPDATE"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Password must be at least 6 characters long", expect.any(Object));
    });
  });

  it("submits the form successfully", async () => {
    axios.put.mockResolvedValue({
      data: {
        success: true,
        updatedUser: {
          name: "John Updated",
          email: "john@example.com",
          phone: "9876543210",
          address: "456 Avenue, New City",
        },
        message: "Profile Updated Successfully",
      },
    });

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Enter Your Name"), {
      target: { value: "John Updated" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter Your Phone"), {
      target: { value: "9876543210" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter Your Address"), {
      target: { value: "456 Avenue, New City" },
    });

    fireEvent.click(screen.getByText("UPDATE"));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith("/api/v1/auth/profile", {
        name: "John Updated",
        email: "john@example.com",
        password: undefined,
        phone: "9876543210",
        address: "456 Avenue, New City",
      });

      expect(toast.success).toHaveBeenCalledWith("Profile Updated Successfully");
    });
  });

  it("handles API failure", async () => {
    axios.put.mockRejectedValue({
      response: { data: { message: "Update failed" } },
    });

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("UPDATE"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Update failed");
    });
  });
});
