import { useEffect, useState } from "react";

const useFetchproducts = () => {

  const [productData, setProductData] = useState({});

  useEffect(()=>{
    const fetchData = () =>{
      const result = fetch('https://dummyjson.com/products');
    setProductData(result)
    }
    fetchData();
  },[])

  return {productData};
}

export default useFetchproducts