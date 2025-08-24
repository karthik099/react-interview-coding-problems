import { render, screen, waitFor } from '@testing-library/react'
import App from './App'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom';

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

const mockFetch = (data: any, ok = true) => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok,
      json: () => Promise.resolve(data),
    } as Response)
  ) as unknown as typeof fetch;
};

describe('App', () => {

  it('renders the App component without produtData', () => {
    render(<App />)
    expect(screen.queryByText(/eCommerce website/i)).not.toBeInTheDocument();
  })


  it("fetches and displays products", async () => {
    mockFetch({
      products: [
        { id: 1, title: "Product 1", description: "Desc", price: 100, rating: 5, images: ["img.png"] },
        { id: 2, title: "Product 2", description: "Desc2", price: 200, rating: 4, images: ["img2.png"] },
      ],
    });
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>);
    expect(await screen.findByText(/eCommerce website/i)).toBeInTheDocument();
    expect(await screen.findByText(/Product 1/i)).toBeInTheDocument();
    expect(await screen.findByText(/Product 2/i)).toBeInTheDocument();
  });


  it("handles fetch error gracefully", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => { });
    global.fetch = vi.fn(() => Promise.reject("API error")) as unknown as typeof fetch;
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>);
    await waitFor(() => {
      expect(errorSpy).toHaveBeenCalledWith("Failed to fetch products:", "API error");
    });
    errorSpy.mockRestore();
  });
})