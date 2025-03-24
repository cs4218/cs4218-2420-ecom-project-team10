import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import About from "../pages/About";

// Mock Layout to isolate About component
jest.mock("../components/Layout", () => ({ children, title }) => (
  <div data-testid="layout" title={title}>{children}</div>
));

describe("About Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders About page correctly", () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );

    // Check if Layout renders correctly
    const layout = screen.getByTestId("layout");
    expect(layout).toBeInTheDocument();
    expect(layout).toHaveAttribute("title", "About us - Ecommerce app");

    // Check if image is rendered correctly
    const aboutImage = screen.getByAltText("contactus");
    expect(aboutImage).toBeInTheDocument();
    expect(aboutImage).toHaveAttribute("src", "/images/about.jpeg");

    // Check if text content is present
    expect(screen.getByText("Add text")).toBeInTheDocument();
  });
});
