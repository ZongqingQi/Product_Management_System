// src/components/Navbar.jsx
import React from "react";
import "../styles/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img
          src="/logo.png"
          alt="Logo"
          className="navbar-logo"
        />
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
        <button className="navbar-btn">Sign In</button>
        <div className="navbar-cart">
          <img src="/cart-icon.svg" alt="Cart" />
          <span className="navbar-cart-amount">$0.00</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;