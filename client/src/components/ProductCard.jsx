import { Link } from 'react-router-dom';
import '../styles/ProductCard.css'

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`}>
        <img src={product.image} alt={product.name} />
      </Link>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <p>Qty: {product.quantity}</p>
      <Link to={`/edit/${product._id}`} className="edit-button">
        <button>Edit</button>
      </Link>
    </div>
  );
}

export default ProductCard;