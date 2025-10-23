import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, updateQuantity } from "../features/cart/cartSlice";
import axios from "axios";
import "../styles/ProductDetailPage.css";

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const { user, isLoggedIn } = useContext(LoginContext);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  // Get return page and search query from URL
  const searchParams = new URLSearchParams(window.location.search);
  const returnPage = searchParams.get("returnPage") || "1";
  const searchQuery = searchParams.get("search") || "";

  const cartItem = cartItems.find((i) => i._id === id);
  const qty = cartItem ? cartItem.quantity : 0;

  useEffect(() => {
    axios
      .get(`http://localhost:5001/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error("Error fetching product:", err));
  }, [id]);

  if (!product) return <div>Loading product details...</div>;

  return (
    <div>
      <div
        style={{
          maxWidth: "1000px",
          margin: "20px auto",
          padding: "0 20px",
        }}
      >
        <button
          onClick={() => {
            // Navigate back to the same page the user came from
            const params = new URLSearchParams();
            params.set("page", returnPage);
            if (searchQuery) {
              params.set("search", searchQuery);
            }
            navigate(`/?${params.toString()}`);
          }}
          style={{
            background: "none",
            border: "none",
            color: "#333",
            fontSize: "14px",
            cursor: "pointer",
            marginBottom: "10px",
          }}
        >
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
            {product.quantity === 0 && (
              <span className="out-of-stock">Out of Stock</span>
            )}
          </div>
          <p className="product-detail-description">{product.description}</p>

          <div className="detail-buttons">
            {isLoggedIn && (
              qty === 0 ? (
                <button
                  className="add-to-cart"
                  onClick={() => dispatch(addToCart(product))}
                >
                  Add To Cart
                </button>
              ) : (
                <div className="quantity-control">
                  <button
                    className="qty-btn"
                    onClick={() =>
                      dispatch(
                        updateQuantity({
                          id: product._id,
                          quantity: qty - 1,
                        })
                      )
                    }
                  >
                    −
                  </button>
                  <span className="qty-value">{qty}</span>
                  <button
                    className="qty-btn"
                    onClick={() =>
                      dispatch(
                        updateQuantity({
                          id: product._id,
                          quantity: qty + 1,
                        })
                      )
                    }
                  >
                    ＋
                  </button>
                </div>
              )
            )}

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
      </div>
    </div>
  );
}

export default ProductDetailPage;