import { useEffect, useState } from 'react';
import './App.css'
import Card from './components/cart/card'
// import useFetchproducts from './hooks/useFetchproducts';

function App() {

  const [productData, setProductData] = useState([]);
  const [cart, setCart] = useState({});
  useEffect(() => {

    //setting to localstorage for the first time
    if (!localStorage.getItem('Cart')) {
      localStorage.setItem('Cart', JSON.stringify(cart))
    }

    // Product Data fetch - can be moved to a custom Hook as well
    const fetchData = async () => {
      fetch('https://dummyjson.com/products').then((res) => {
        return res.json()
      }).then((data) => {
        console.log(data?.products)
        setProductData(data?.products)
      })
    }
    fetchData(); // fetch call

  }, [])

  return (
    <div style={{ display: 'flex' }}>      

      {productData?.map((item) => {
        <Card data={item}/>
      })}
    </div>
  )
}

export default App
