import ProductForm from '../components/ProductForm';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CreateProductPage() {
  const navigate = useNavigate();

  const handleCreate = async (productData) => {
    try {
      await axios.post('http://localhost:5001/api/products', productData);
      navigate('/'); // 成功后跳转回首页
    } catch (error) {
      console.error('Failed to create product:', error);
    }
  };

  return (
    <div className="create-product-page">
      <ProductForm onSubmit={handleCreate} />
    </div>
  );
}

export default CreateProductPage;