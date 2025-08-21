type typeData = {
  title?:string,
  description?:string,
price?:number,
rating?:number,
images?:Array
}

function Card(data:typeData) {

const handleAddToCart = (id)=>{


// save to localStorage
localStorage.setItem
}


  return (
    <div className="card" style={{display:'flex', flexDirection:'column', width:'200px',}}>
    <img src='src\assets\product.jpg'/>
      <h4>{data?.title}</h4>
      <p>{data?.description}</p>
      <span>{`$ {data?.price}`}</span>
      <span>Rating 4.3</span>
      {/* <button onClick={handleAddToCart(data?.id)}>Add to Cart</button> */}
    </div>
  )
}

export default Card
