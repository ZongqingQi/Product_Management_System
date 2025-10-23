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
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoggedIn } = useContext(LoginContext);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  // Get page and search from URL parameters
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search") || "";
  const pageFromUrl = parseInt(searchParams.get("page")) || 1;
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [limit, setLimit] = useState(12); // Responsive: dynamically adjust based on screen size

  // Calculate items per page based on screen width
  const calculateLimit = () => {
    const width = window.innerWidth;
    if (width > 1200) return 12;      // Large screen: 4 columns × 3 rows
    if (width > 800) return 9;        // Medium screen: 3 columns × 3 rows
    if (width > 500) return 6;        // Small screen: 2 columns × 3 rows
    return 4;                         // Mobile: 1 column × 4 rows
  };

  // Listen to window resize and dynamically adjust limit
  useEffect(() => {
    const handleResize = () => {
      const newLimit = calculateLimit();
      if (newLimit !== limit) {
        setLimit(newLimit);
        setCurrentPage(1); // Reset to first page
      }
    };

    // Set initial value
    handleResize();

    // Add resize event listener
    window.addEventListener("resize", handleResize);

    // Cleanup function
    return () => window.removeEventListener("resize", handleResize);
  }, [limit]);

  // Sync currentPage state with URL parameter
  useEffect(() => {
    setCurrentPage(pageFromUrl);
  }, [pageFromUrl]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5001/api/products", {
          params: {
            page: currentPage,
            limit: limit,
            ...(searchQuery && { search: searchQuery }),
          },
        });
        setProducts(res.data.products);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchQuery, currentPage, limit]);

  const getCartQuantity = (id) => {
    const item = cartItems.find((i) => i._id === id);
    return item ? item.quantity : 0;
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      // Update URL with new page number
      const params = new URLSearchParams(location.search);
      params.set("page", newPage);
      navigate(`?${params.toString()}`, { replace: true });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5001/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Refresh product list
      const res = await axios.get("http://localhost:5001/api/products", {
        params: {
          page: currentPage,
          limit: limit,
          ...(searchQuery && { search: searchQuery }),
        },
      });
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);

      alert("Product deleted successfully!");
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product. Please try again.");
    }
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
                    onClick={() => {
                      // Preserve current page in URL when navigating to detail
                      const params = new URLSearchParams(location.search);
                      navigate(`/product/${product._id}?returnPage=${currentPage}${searchQuery ? `&search=${searchQuery}` : ''}`);
                    }}
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
                    <div className="admin-actions">
                      <button
                        className="edit-btn"
                        onClick={() => navigate(`/edit/${product._id}`)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteProduct(product._id, product.name)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination-container">
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>

          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;