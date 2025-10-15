import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ProductForm from '../components/ProductForm';
import axios from 'axios';

function EditProductPage() {
  const { id } = useParams(); // 从 URL 获取商品 ID
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // 获取当前商品信息
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error('Failed to fetch product:', err);
      }
    };
    fetchProduct();
  }, [id]);

  const handleUpdate = async (updatedProduct) => {
    try {
      await axios.put(`http://localhost:5001/api/products/${id}`, updatedProduct);
      navigate('/'); // 成功后返回首页
    } catch (err) {
      console.error('Failed to update product:', err);
      alert('Failed to update product.');
    }
  };

  if (!product) return <div>Loading product...</div>;

  return (
    <div className="edit-product-wrapper">
      <ProductForm mode="edit" initialData={product} onSubmit={handleUpdate} />
    </div>
  );
}

export default EditProductPage;