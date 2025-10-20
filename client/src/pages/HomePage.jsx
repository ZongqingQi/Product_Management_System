import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, updateQuantity } from "../features/cart/cartSlice";
import "../styles/HomePage.css";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoggedIn } = useContext(LoginContext);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5001/api/products", {
          params: searchQuery ? { search: searchQuery } : {},
        });
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchQuery]);

  const getCartQuantity = (id) => {
    const item = cartItems.find((i) => i._id === id);
    return item ? item.quantity : 0;
  };

  if (loading) return <div className="loading">Loading products...</div>;

  return (
    <div className="homepage-container">
      <h1 className="homepage-title">
        {searchQuery ? `Search results for "${searchQuery}"` : "Product List"}
      </h1>

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

      {products.length === 0 ? (
        <p className="no-results">No products found.</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => {
            const qty = getCartQuantity(product._id);
            return (
              <div key={product._id} className="product-card">
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                    onClick={() => navigate(`/product/${product._id}`)}
                  />
                )}
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <p className="product-price">${product.price}</p>
                  <p>Stock: {product.quantity}</p>

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
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HomePage;