import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { LoginContext } from "../context/LoginContext";
import { clearCart } from "../features/cart/cartSlice";
import "../styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoggedIn, user, logout, loading } = useContext(LoginContext);
  const cartItems = useSelector((state) => state.cart.items);
  const [query, setQuery] = useState("");

  const handleAuthClick = () => {
    if (isLoggedIn) {
      logout();
      dispatch(clearCart());
      navigate("/login");
    } else {
      navigate("/login");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const trimmed = query.trim();

    if (trimmed) {
      navigate(`/?search=${encodeURIComponent(trimmed)}`);
    } else {
      navigate(`/`);
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div
          className="navbar-left"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          <span className="navbar-brand">Chuwa Management</span>
        </div>

        <div className="navbar-center">
          {isLoggedIn && (
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="navbar-search"
              />
            </form>
          )}
        </div>

        <div className="navbar-right">
          {loading ? (
            <span>Loading...</span>
          ) : isLoggedIn && user ? (
            <>
              <span style={{ marginRight: "10px" }}>
                Hi, {user.name} ({user.role})
              </span>
              <button className="navbar-btn" onClick={handleAuthClick}>
                Sign Out
              </button>
            </>
          ) : (
            <button className="navbar-btn" onClick={handleAuthClick}>
              Sign In
            </button>
          )}

          <div
            className="navbar-cart"
            onClick={() => navigate("/cart")}
            style={{ cursor: "pointer" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span className="navbar-cart-amount">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;