import '../styles/ProductCard.css'

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <p>Qty: {product.quantity}</p>
      <button>Edit</button>
    </div>
  );
}

export default ProductCard;