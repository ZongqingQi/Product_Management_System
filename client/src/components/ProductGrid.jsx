import { useEffect, useState } from 'react';
import { fetchProducts } from '../api/products';
import ProductCard from './ProductCard';
import '../styles/ProductGrid.css'

function ProductGrid() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await fetchProducts();
      setProducts(data);
    }
    load();
  }, []);

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductGrid;