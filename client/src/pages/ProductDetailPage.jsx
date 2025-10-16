import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ProductDetailPage.css';

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5001/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error('Error fetching product:', err));
  }, [id]);

  if (!product) return <div>Loading product details...</div>;

  return (
    <div>
        <div style={{ maxWidth: '1000px', margin: '20px auto', padding: '0 20px' }}>
            <button onClick={() => navigate('/')} style={{
                background: 'none',
                border: 'none',
                color: '#333',
                fontSize: '14px',
                cursor: 'pointer',
                marginBottom: '10px'
            }}>
                ← Back to Home
            </button>
            </div>
        <div className="product-detail-container">
        <img
            src={product.image}
            alt={product.name}
            className="product-detail-image"
        />

        <div className="product-detail-info">
            <p className="product-detail-category">{product.category}</p>
            <h2 className="product-detail-name">{product.name}</h2>
            <div className="product-detail-price">
            ${product.price}
            {product.quantity === 0 && <span className="out-of-stock">Out of Stock</span>}
            </div>
            <p className="product-detail-description">{product.description}</p>

            <div className="detail-buttons">
            <button className="add-to-cart">Add To Cart</button>
            <button className="edit" onClick={() => navigate(`/edit/${product._id}`)}>Edit</button>
            </div>
        </div>
        </div>
    </div>
  );
}

export default ProductDetailPage;