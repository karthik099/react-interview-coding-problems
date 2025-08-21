import { useEffect, useState } from 'react';
import './App.css'
import Card from './components/cart/card'
import cartIcon from "./assets/cart.png";

const App = () => {

  const [productData, setProductData] = useState([]);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  useEffect(() => {

    const cart = localStorage.getItem("cart");
    if (cart) setCartItemsCount(JSON.parse(cart).length);

    // Product Data fetch
    const fetchData = async () => {
      try {
        const res = await fetch('https://dummyjson.com/products');
        const data = await res.json();
        setProductData(data?.products || []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };
    fetchData(); // fetch call
  }, [])

  return (
    <>
      {productData.length && (<div>
        <header>
          <h1>eCommerce website</h1>

          <div className='cart-badge'>
            <img height={'32px'} src={cartIcon}></img>
            <span className='cart-item-count'>{cartItemsCount}</span>
          </div>
        </header>
        <div className='card-wrapper'>
          {productData?.map((item) => {
            return <Card key={item?.id} product={item} onCartUpdate={setCartItemsCount} />
          })}
        </div>
      </div>)}

    </>

  )
}

export default App
