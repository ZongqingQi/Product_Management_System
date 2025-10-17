import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";
import "../styles/HomePage.css"; // ✅ 确保样式文件路径正确

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { user, isLoggedIn } = useContext(LoginContext);

  useEffect(() => {
    axios.get("http://localhost:5001/api/products").then((res) => {
      setProducts(res.data);
    });
  }, []);

  return (
    <div className="homepage-container">
      <h1 className="homepage-title">Product List</h1>

      {/* ✅ 仅管理员可见的创建按钮 */}
      {isLoggedIn && user?.role === "admin" && (
        <div className="create-btn-container">
          <button
            className="create-product-btn"
            onClick={() => navigate("/create")}
          >
            + Create Product
          </button>
        </div>
      )}

      <div className="product-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            {/* ✅ 保留图片显示 */}
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="product-image"
              />
            )}
            <div className="product-info">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p className="product-price">${product.price}</p>

              {/* ✅ 仅管理员显示 Edit 按钮 */}
              {isLoggedIn && user?.role === "admin" && (
                <button
                  className="edit-btn"
                  onClick={() => navigate(`/edit/${product._id}`)}
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
