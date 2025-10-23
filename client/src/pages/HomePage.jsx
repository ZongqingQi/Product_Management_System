/**
 * HomePage Component
 * Main product listing page with pagination, search, and cart functionality
 *
 * Features:
 * - Responsive grid layout that adjusts items per page based on screen size
 * - URL-based pagination state (preserves page on navigation)
 * - Product search functionality
 * - Add to cart with quantity controls
 * - Admin CRUD operations (create, edit, delete products)
 *
 * Redux Connection:
 * - useDispatch: Gets dispatch function to send actions (addToCart, updateQuantity)
 * - useSelector: Reads cart items from Redux store to show current quantities
 * - Actions imported: addToCart, updateQuantity from cartSlice
 */

import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, updateQuantity } from "../features/cart/cartSlice";
import "../styles/HomePage.css";

const HomePage = () => {
  // Local state management
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoggedIn } = useContext(LoginContext);

  // Redux hooks for cart management
  // dispatch - Send actions to Redux store
  const dispatch = useDispatch();
  // cartItems - Read current cart state from Redux store
  // Component re-renders when cart state changes
  const cartItems = useSelector((state) => state.cart.items);

  // Get page and search from URL parameters
  // This preserves pagination state when navigating between pages
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search") || "";
  const pageFromUrl = parseInt(searchParams.get("page")) || 1;
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [limit, setLimit] = useState(12); // Responsive: dynamically adjust based on screen size

  /**
   * Calculate items per page based on screen width
   * This ensures optimal grid layout on different devices
   * Returns number of items to display per page
   */
  const calculateLimit = () => {
    const width = window.innerWidth;
    if (width > 1200) return 12;      // Large screen: 4 columns × 3 rows
    if (width > 800) return 9;        // Medium screen: 3 columns × 3 rows
    if (width > 500) return 6;        // Small screen: 2 columns × 3 rows
    return 4;                         // Mobile: 1 column × 4 rows
  };

  /**
   * Responsive pagination effect
   * Listens to window resize and dynamically adjusts items per page
   * Resets to first page when screen size changes
   */
  useEffect(() => {
    const handleResize = () => {
      const newLimit = calculateLimit();
      if (newLimit !== limit) {
        setLimit(newLimit);
        setCurrentPage(1); // Reset to first page when layout changes
      }
    };

    // Set initial value on component mount
    handleResize();

    // Add resize event listener
    window.addEventListener("resize", handleResize);

    // Cleanup: remove event listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, [limit]);

  /**
   * Sync currentPage state with URL parameter
   * This ensures the page state is always in sync with the URL
   * Allows users to bookmark specific pages or use browser back/forward
   */
  useEffect(() => {
    setCurrentPage(pageFromUrl);
  }, [pageFromUrl]);

  /**
   * Fetch products from API with pagination and search
   * Re-fetches when search query, page, or limit changes
   */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5001/api/products", {
          params: {
            page: currentPage,
            limit: limit,
            ...(searchQuery && { search: searchQuery }), // Only include search if it exists
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

  /**
   * Get quantity of a product in the cart
   * Returns quantity in cart (0 if not in cart)
   */
  const getCartQuantity = (id) => {
    const item = cartItems.find((i) => i._id === id);
    return item ? item.quantity : 0;
  };

  /**
   * Handle pagination with URL state preservation
   * Updates both component state and URL parameter
   * This allows users to share/bookmark specific pages
   */
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      // Update URL with new page number (preserves state)
      const params = new URLSearchParams(location.search);
      params.set("page", newPage);
      navigate(`?${params.toString()}`, { replace: true });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  /**
   * Handle product deletion (admin only)
   * Shows confirmation dialog and refreshes list after deletion
   */
  const handleDeleteProduct = async (productId, productName) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5001/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Refresh product list after deletion
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
                      // Preserve current page and search when navigating to product detail
                      // This allows the "Back" button to return to the exact same page
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
                        onClick={() =>
                          // Dispatch addToCart action to Redux store
                          // This adds product to cart with initial quantity of 1
                          dispatch(addToCart(product))
                        }
                      >
                        Add To Cart
                      </button>
                    ) : (
                      <div className="quantity-control">
                        <button
                          className="qty-btn"
                          onClick={() =>
                            // Dispatch updateQuantity action to decrease cart quantity
                            // Redux store updates and component re-renders with new quantity
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
                            // Dispatch updateQuantity action to increase cart quantity
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