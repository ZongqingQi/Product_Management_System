/**
 * User Controller
 * Handles user authentication (registration, login) and profile management
 * Includes JWT token generation for authenticated sessions
 */

import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

/**
 * POST /api/users/register (or /signup)
 * Register a new user account
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email is already registered
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create new user (password will be hashed by pre-save middleware in User model)
    const user = await User.create({ name, email, password, role });

    // Generate JWT token valid for 7 days
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Return user data with token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * POST /api/users/login
 * Authenticate a user and return JWT token
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // Verify user exists and password matches (using matchPassword method from User model)
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token valid for 7 days
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Return user data with token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/users/me
 * Get current authenticated user's profile
 * Requires valid JWT token (enforced by protect middleware)
 */
export const getMe = async (req, res) => {
  try {
    // Check if user is authenticated (req.user is set by protect middleware)
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Return user profile data
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      createdAt: req.user.createdAt,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
};
