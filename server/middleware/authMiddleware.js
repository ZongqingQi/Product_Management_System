/**
 * Authentication Middleware
 * Provides JWT token validation and role-based access control
 */

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Protect Middleware
 * Verifies JWT token and attaches authenticated user to request
 * Usage: Add this middleware before route handlers that require authentication
 */
export const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header contains Bearer token
  // Expected format: "Bearer <token>"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from "Bearer <token>" string
      token = req.headers.authorization.split(' ')[1];

      // Verify token and decode payload
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user from database and attach to request object (exclude password field)
      req.user = await User.findById(decoded.id).select('-password');

      // Continue to next middleware/route handler
      return next();
    } catch (error) {
      console.error('JWT verification failed:', error);
      return res.status(401).json({ message: 'Not authorized, token invalid' });
    }
  }

  // If no token was found in Authorization header
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

/**
 * Admin Only Middleware
 * Restricts access to admin users only
 * Must be used AFTER the protect middleware
 * Usage: router.post('/admin-route', protect, adminOnly, handler)

 */
export const adminOnly = (req, res, next) => {
  // Check if user exists and has admin role
  if (req.user && req.user.role === 'admin') {
    next(); // User is admin, proceed to route handler
  } else {
    // User is not admin or not authenticated
    res.status(403).json({ message: 'Forbidden: Admins only' });
  }
};

