import React, { useState, useEffect } from 'react';
import '../styles/ProductForm.css';

function ProductForm({ mode = 'create', initialData = {}, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    quantity: '',
    image: '',
  });

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        category: initialData.category || '',
        price: initialData.price || '',
        quantity: initialData.quantity || '',
        image: initialData.image || '',
      });
    }
  }, [mode, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // pass form data back
  };

  return (
    <div className="form-container">
      <h2>{mode === 'edit' ? 'Edit Product' : 'Create Product'}</h2>
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label>Product Name</label>
          <input name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Product Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows={3} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="">Select a Category</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing & Accessories">Clothing & Accessories</option>
              <option value="Books & Stationery">Books & Stationery</option>
              <option value="Sports">Sports</option>
              <option value="Home">Home</option>
            </select>
          </div>

          <div className="form-group">
            <label>Price</label>
            <input name="price" type="number" value={formData.price} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>In Stock Quantity</label>
            <input
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              required
              onWheel={(e) => e.target.blur()}
              onKeyDown={(e) => {
                if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault();
              }}
            />
          </div>

          <div className="form-group">
            <label>Add Image Link</label>
            <input name="image" value={formData.image} onChange={handleChange} />
          </div>
        </div>

        {formData.image && (
          <div className="image-preview-box">
            <img src={formData.image} alt="preview" className="preview-img" />
            <p>image preview!</p>
          </div>
        )}

        <button type="submit" className="submit-btn">
          {mode === 'edit' ? 'Save Changes' : 'Add Product'}
        </button>
      </form>
    </div>
  );
}

export default ProductForm;