import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";
import "../styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useContext(LoginContext);

  const handleAuthClick = () => {
    if (isLoggedIn) {
      logout();
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src="/logo.png" alt="Logo" className="navbar-logo" />
        <span className="navbar-brand">Management</span>
      </div>

      <div className="navbar-center">
        <input
          type="text"
          placeholder="Search products..."
          className="navbar-search"
        />
      </div>

      <div className="navbar-right">
        {isLoggedIn && user ? (
          <span style={{ marginRight: "10px" }}>
            👋 Hi, {user.name || user.email}
          </span>
        ) : null}
        <button className="navbar-btn" onClick={handleAuthClick}>
          {isLoggedIn ? "Sign Out" : "Sign In"}
        </button>
        <div className="navbar-cart">
          <img src="/cart-icon.svg" alt="Cart" />
          <span className="navbar-cart-amount">$0.00</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
