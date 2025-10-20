import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loadUserCart, clearCart } from "../features/cart/cartSlice";

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    verifyToken();
  }, []);

  const verifyToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get("http://localhost:5001/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      setIsLoggedIn(true);
      dispatch(loadUserCart());
    } catch (err) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  const login = (userData) => {
    localStorage.setItem("token", userData.token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setIsLoggedIn(true);

    dispatch(loadUserCart());
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsLoggedIn(false);

    dispatch(clearCart());
  };

  return (
    <LoginContext.Provider value={{ isLoggedIn, user, login, logout, loading }}>
      {children}
    </LoginContext.Provider>
  );
};