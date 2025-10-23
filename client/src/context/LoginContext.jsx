/**
 * LoginContext - Authentication State Management
 * Provides authentication state and methods to the entire application
 *
 * Features:
 * - JWT token verification on app load
 * - User session persistence via localStorage
 * - Integration with Redux cart (user-specific cart loading)
 * - Global authentication state accessible to all components
 */

import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loadUserCart, clearCart } from "../features/cart/cartSlice";

// Create context for authentication state
export const LoginContext = createContext();

/**
 * LoginProvider Component
 * Wraps the app to provide authentication context to all children
 */
export const LoginProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Prevents flash of logged-out state
  const dispatch = useDispatch();

  /**
   * Verify token on component mount
   * This runs when the app first loads to check if user has a valid session
   */
  useEffect(() => {
    verifyToken();
  }, []);

  /**
   * Verify JWT token with server
   * Checks if stored token is still valid
   * If valid, restores user session and loads their cart
   * If invalid, clears stored authentication data
   */
  const verifyToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // Verify token with server
      const res = await axios.get("http://localhost:5001/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      setIsLoggedIn(true);
      // Load user's cart from localStorage
      dispatch(loadUserCart());
    } catch (err) {
      // Token is invalid or expired, clear authentication data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login function
   * Called after successful login/signup
   * Stores JWT token and user data, then loads user's cart
   * @param {Object} userData - User data including token from server
   */
  const login = (userData) => {
    localStorage.setItem("token", userData.token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setIsLoggedIn(true);

    // Load user-specific cart from localStorage
    dispatch(loadUserCart());
  };

  /**
   * Logout function
   * Clears all authentication data and cart
   * Removes token and user data from localStorage
   */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsLoggedIn(false);

    // Clear cart from Redux store and localStorage
    dispatch(clearCart());
  };

  // Provide authentication state and methods to all children
  return (
    <LoginContext.Provider value={{ isLoggedIn, user, login, logout, loading }}>
      {children}
    </LoginContext.Provider>
  );
};