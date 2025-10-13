import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import pingRoutes from './routes/pingRoutes.js'
import cors from 'cors';

dotenv.config()

const app = express()

// Avoid cross original issues
app.use(cors());

// Middleware - JSON body parser
app.use(express.json())

// Routes
app.use('/api', pingRoutes)

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ MongoDB connected')
  } catch (err) {
    console.error('❌ MongoDB connection error:', err)
    process.exit(1)
  }
}

// Start server
const PORT = process.env.PORT || 5000

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  })
})