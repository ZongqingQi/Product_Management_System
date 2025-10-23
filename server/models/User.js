/**
 * User Model
 * Defines the schema for user accounts with authentication features
 * Includes password hashing and validation methods
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Define the user schema with validation rules
const userSchema = new mongoose.Schema({
  // User's full name
  name: {
    type: String,
    required: [true, 'User name is required'],
  },
  // User's email address - must be unique across all users
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true, // Ensure no duplicate emails in database
    match: [/.+\@.+\..+/, 'Please enter a valid email'], // Regex validation for email format
  },
  // User's password - will be hashed before saving
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6, // Minimum password length for security
  },
  // User role determines permissions (regular user or admin)
  role: {
    type: String,
    enum: ['regular', 'admin'], // Only these two roles are allowed
    default: 'regular', // Default to regular user
  },
}, { timestamps: true }); // Automatically add createdAt and updatedAt fields

/**
 * Pre-save middleware: Hash password before saving to database
 * Only runs if password has been modified (new user or password change)
 */
userSchema.pre('save', async function(next) {
  // Skip hashing if password hasn't been modified
  if (!this.isModified('password')) return next();

  // Generate salt and hash the password
  const salt = await bcrypt.genSalt(10); // Salt rounds for bcrypt
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Instance method: Compare entered password with hashed password
 * Returns true if password matches, false otherwise
 */
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create and export the User model
const User = mongoose.model('User', userSchema);
export default User;
