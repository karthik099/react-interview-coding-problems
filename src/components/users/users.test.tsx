import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import Users from "./users"; // ✅ lowercase users
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";

// keep track of observer instances
let observerCallback: ((entries: any[]) => void) | null = null;

class MockIntersectionObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
  constructor(cb: (entries: any[]) => void) {
    observerCallback = cb;
  }
}
(global as any).IntersectionObserver = MockIntersectionObserver;

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch as any;

const mockUsers = [
  { id: 1, firstName: "John", lastName: "Doe", email: "john@doe.com", gender: "male" },
  { id: 2, firstName: "Jane", lastName: "Smith", email: "jane@smith.com", gender: "female" }
];

describe("Users Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    observerCallback = null;
  });

  function setupFetch(data = mockUsers) {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ users: data }),
    } as Response);
  }

  it("renders the table with headers", async () => {
    setupFetch();
    render(
      <BrowserRouter>
        <Users />
      </BrowserRouter>
    );
    expect(screen.getByText("User List with Infinite Scroll")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(await screen.findByText("John Doe")).toBeInTheDocument();
  });

  it("applies gender filter", async () => {
    setupFetch();
    render(
      <BrowserRouter>
        <Users />
      </BrowserRouter>
    );

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "female" } });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("q=&limit=10&skip=0")
      );
    });
  });

  it("shows loading state", async () => {
    setupFetch();
    render(
      <BrowserRouter>
        <Users />
      </BrowserRouter>
    );
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    await screen.findByText("John Doe");
  });

  it("handles fetch error gracefully", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));
    render(
      <BrowserRouter>
        <Users />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });
  });

  it("supports infinite scroll by triggering IntersectionObserver", async () => {
    setupFetch();
    render(
      <BrowserRouter>
        <Users />
      </BrowserRouter>
    );
    await screen.findByText("Jane Smith");

    // simulate intersection
    act(() => {
      observerCallback?.([{ isIntersecting: true }]);
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });
});
