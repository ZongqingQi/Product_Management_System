import ProductForm from '../components/ProductForm';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CreateProductPage() {
  const navigate = useNavigate();

  const handleCreate = async (productData) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5001/api/products",
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/");
    } catch (error) {
      console.error("Failed to create product:", error);
      alert("Failed to create product. Check console for details.");
    }
  };

  return (
    <div className="create-product-page">
      <ProductForm onSubmit={handleCreate} />
    </div>
  );
}

export default CreateProductPage;