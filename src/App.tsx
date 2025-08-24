import { useEffect, useState } from 'react';
import './App.css'
import Card from './components/card/card'
import cartIcon from "./assets/cart.png";
import Navbar from './components/navbar/navbar';
import { Route, Routes } from 'react-router-dom';
import Users from './components/users/users';

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
          <div className='header-wrap'>
            <Navbar />
            <div className='cart-badge'>
              <img height={'32px'} src={cartIcon}></img>
              <span className='cart-item-count'>{cartItemsCount}</span>
            </div>
          </div>
        </header>
        <Routes>
        {/* Home route shows products */}
        <Route
          path="/"
          element={
            <div className='card-wrapper'>
              {productData?.map((item) => (
                <Card key={item?.id} product={item} onCartUpdate={setCartItemsCount} />
              ))}
            </div>
          }
        />
        {/* Users route */}
        <Route path="/users" element={<Users />} />
      </Routes>
      </div>)}

    </>

  )
}

export default App
