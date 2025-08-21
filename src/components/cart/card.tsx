import { useEffect, useState } from 'react';
import './card.css'

interface Product {
  id: number;
  title?: string;
  description?: string;
  price?: number;
  rating?: number;
  images?: string[];
}
interface Props {
  product: Product;
  onCartUpdate: (cartCount: number) => void;
}
const Card: React.FC<Props> = ({ product, onCartUpdate }) => {

   const [isAdded, setIsAdded] = useState(false);

  // Load cart from localStorage
  const getCart = (): Product[] => {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  };

  const saveCart = (cart: Product[]) => {
    localStorage.setItem("cart", JSON.stringify(cart));
    onCartUpdate(cart.length);
  };

  const handleAddToCart = (id: number) => {
    let cart = getCart();

    // To Prevent Duplicates
    if (cart.find((item) => item.id === product.id)) {
      setIsAdded(true);
      return;
    }
    cart.push(product);
    saveCart(cart);
    setIsAdded(true);
  }

// Check on mount if product is already in cart
  useEffect(() => {
    const cart = getCart();
    if (cart.find((item) => item.id === product.id)) {
      setIsAdded(true);
    }
  }, [product.id]);
  
  return (
    <div className="card" >
      <img title="product_image" src={product?.images[0]} />
      <h4 className="title">{product?.title}</h4>
      <p className="desc">{product?.description}</p>
      <div className="price">
        <span>$ {product?.price}</span>
        <span>⭐ {product?.rating}</span>
      </div>

      <button 
      className={`add-to-cart ${isAdded ? "added" : ""}`}
      disabled={isAdded}
      onClick={() => { handleAddToCart(product?.id) }}>{isAdded ? "Added" : "Add to Cart"}</button>
    </div>
  )
}

export default Card
