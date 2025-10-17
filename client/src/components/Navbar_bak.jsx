import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";
import "../styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, logout, loading } = useContext(LoginContext);

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
        {loading ? (
          <span>Loading...</span>
        ) : isLoggedIn && user ? (
          <>
            <span style={{ marginRight: "10px" }}>👋 Hi, {user.name}</span>
            <button className="navbar-btn" onClick={handleAuthClick}>
              Sign Out
            </button>
          </>
        ) : (
          <button className="navbar-btn" onClick={handleAuthClick}>
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
