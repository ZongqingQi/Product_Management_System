import { Link } from 'react-router-dom';
import '../styles/ProductControlBar.css';

function ProductControlBar({ sortOption, onSortChange }) {
  return (
    <div className="product-control-bar">
      <h2>Product</h2>

      <div className="product-controls">
        <select value={sortOption} onChange={(e) => onSortChange(e.target.value)}>
          <option value="latest">Sort by: Latest</option>
          <option value="price-asc">Sort by: Price Low to High</option>
          <option value="price-desc">Sort by: Price High to Low</option>
        </select>

        <Link to="/create" className="add-product-btn">
          + Add Product
        </Link>
      </div>
    </div>
  );
}

export default ProductControlBar;