/**
 * ProtectedRoute Component
 * Wrapper component for routes that require authentication or specific roles
 *
 * Features:
 * - Redirects unauthenticated users to login page
 * - Supports role-based access control (e.g., admin-only pages)
 * - Shows loading state while checking authentication
 */

import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isLoggedIn, loading, user } = useContext(LoginContext);

  // Show loading state while verifying authentication
  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "100px" }}>Loading...</p>;
  }

  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access if required
  // If a specific role is required and user doesn't have it, redirect to home
  if (requiredRole && user?.role !== requiredRole) {
    alert("You do not have permission to access this page.");
    return <Navigate to="/" replace />;
  }

  // User is authenticated and authorized, render children
  return children;
};

export default ProtectedRoute;
