import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isLoggedIn, loading, user } = useContext(LoginContext);

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "100px" }}>Loading...</p>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    alert("You do not have permission to access this page.");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
