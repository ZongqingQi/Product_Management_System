/**
 * Main Server File - Product Management System
 * Sets up Express server, middleware, routes, and MongoDB connection
 */

import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors';

import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js';

// Load environment variables from .env file
dotenv.config()

// Initialize Express application
const app = express()

// Enable CORS to allow requests from different origins (e.g., frontend on different port)
app.use(cors());

// Middleware to parse incoming JSON request bodies
app.use(express.json())

// Mount API routes
// All product-related endpoints will be prefixed with /api/products
app.use('/api/products', productRoutes);
// All user-related endpoints will be prefixed with /api/users
app.use('/api/users', userRoutes);

/**
 * Connect to MongoDB database
 * Uses connection string from environment variables
 * Exits process if connection fails
 */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('MongoDB connected')
  } catch (err) {
    console.error('MongoDB connection error:', err)
    process.exit(1) // Exit with failure code
  }
}

// Server configuration - use PORT from .env or default to 5001
const PORT = process.env.PORT || 5001

/**
 * Initialize and start the server
 * First connects to database, then starts listening for requests
 */
const startServer = async () => {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
}

// Start the server
startServer()