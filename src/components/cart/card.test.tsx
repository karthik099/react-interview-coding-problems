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
  description: "Test Product Desc.",
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
  render(<Card product={mockProduct} onCartUpdate={() => {}} />);

  expect(screen.getByText(/test product/i)).toBeInTheDocument();
  expect(screen.getByText(/test product desc./i)).toBeInTheDocument();
  expect(screen.getByText("$ 9.99")).toBeInTheDocument();
  expect(screen.getByTitle("product_image")).toHaveAttribute("src", "test.jpg");
});

  it('add to button click', () => {
    render(<Card data/>)
    const button = screen.findByRole('button')
    fireEvent.click(button);
  })
})