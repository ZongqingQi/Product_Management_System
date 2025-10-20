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
              👋 Hi, {user.name} ({user.role})
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
          <img src="/cart-icon.svg" alt="Cart" />
          <span className="navbar-cart-amount">
            ${total.toFixed(2)}
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;