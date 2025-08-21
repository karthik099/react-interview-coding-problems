import { fireEvent, render, screen } from '@testing-library/react'
import Card from './card'
import { beforeEach, describe, expect, it, vi } from 'vitest'

interface Product {
  id: number;
  title?: string;
  description?: string;
  price?: number;
  rating?: number;
  images?: string[];
}

const mockProduct: Product = {
  id: 1,
  title: "Test Product",
  description: "This Product is added for testing.",
  price: 9.99,
  rating: 4.5,
  images: ["test.jpg"],
};

describe('App', () => {

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("render product card", () => {
    render(<Card product={mockProduct} onCartUpdate={() => { }} />);

    expect(screen.getByText(/test product/i)).toBeInTheDocument();
    expect(screen.getByText(/this product is added for testing./i)).toBeInTheDocument();
    expect(screen.getByText("$ 9.99")).toBeInTheDocument();
    expect(screen.getByTitle("product_image")).toHaveAttribute("src", "test.jpg");
  });

  it("adds product to cart when clicked", () => {
    const mockUpdate = vi.fn();
    render(<Card product={mockProduct} onCartUpdate={mockUpdate} />);

    const button = screen.getByRole("button", { name: "Add to Cart" });
    fireEvent.click(button);
    expect(button).toHaveTextContent("Added");
    expect(button).toBeDisabled();

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    expect(cart).toHaveLength(1);
    expect(cart[0].id).toBe(1);

    // onCartUpdate call
    expect(mockUpdate).toHaveBeenCalledWith(1);
  });

  it("prevents duplicate add to cart", () => {
    localStorage.setItem("cart", JSON.stringify([mockProduct]));
    const mockUpdate = vi.fn();
    render(<Card product={mockProduct} onCartUpdate={mockUpdate} />);

    // Item already added
    const button = screen.getByRole("button", { name: "Added" });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    const cart = JSON.parse(localStorage.getItem("cart") || "[]"); // only 1 item in cart
    expect(cart).toHaveLength(1);
    expect(mockUpdate).not.toHaveBeenCalled(); // because no new add
  });

 it("marks button as 'Added' if product is already in cart on mount", () => {
    localStorage.setItem("cart", JSON.stringify([mockProduct]));
    const mockUpdate = vi.fn();
    render(<Card product={mockProduct} onCartUpdate={mockUpdate} />);
    const button = screen.getByRole("button", { name: "Added" });
    expect(button).toBeDisabled();
  });

  it("calls onCartUpdate with new count when saving cart", () => {
    const mockUpdate = vi.fn();
    render(<Card product={mockProduct} onCartUpdate={mockUpdate} />);
    const button = screen.getByRole("button", { name: "Add to Cart" });
    fireEvent.click(button);
    expect(mockUpdate).toHaveBeenCalledTimes(1);
    expect(mockUpdate).toHaveBeenCalledWith(1);
  });

})