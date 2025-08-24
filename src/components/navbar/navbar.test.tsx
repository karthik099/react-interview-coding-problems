import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./navbar";
import { describe, it, expect } from "vitest";

describe("Navbar Component", () => {
  it("renders Home and Users links", () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    const homeLink = screen.getByRole("link", { name: "Home" });
    const usersLink = screen.getByRole("link", { name: "Users" });

    expect(homeLink).toBeInTheDocument();
    expect(usersLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");
    expect(usersLink).toHaveAttribute("href", "/users");
  });

  it("applies active class to Home link when on /", () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    const homeLink = screen.getByRole("link", { name: "Home" });
    const usersLink = screen.getByRole("link", { name: "Users" });

    expect(homeLink.className).toContain("active");   // ✅ safer check
    expect(usersLink.className).not.toContain("active");
  });

 
});
