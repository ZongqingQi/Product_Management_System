/**
 * Product Model
 * Defines the schema and validation rules for products in the database
 */

import mongoose from 'mongoose';

// Define the product schema with validation rules
const productSchema = new mongoose.Schema({
    // Product name - required field with whitespace trimming
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true, // Remove leading/trailing whitespace
    },
    // Product description - optional field
    description: {
        type: String,
        default: '', // Default to empty string if not provided
    },
    // Product category - must be one of the predefined values
    category: {
        type: String,
        enum: {
            values: ['Electronics', 'Clothing & Accessories', 'Books & Stationery', 'Clothing', 'Sports', 'Home'],
            message: '{VALUE} is not a valid category', // Custom error message
        },
        required: [true, 'Product category is required'],
    },
    // Product price - must be a non-negative number
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price must be a positive number'], // Minimum value validation
    },
    // Stock quantity - must be a non-negative integer
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [0, 'Quantity cannot be negative'],
        default: 0, // Default to 0 if not provided
        validate: {
            validator: Number.isInteger, // Custom validator to ensure integer values
            message: 'Quantity must be an integer',
        },
    },
    // Product image URL - must be a valid HTTP/HTTPS URL
    image: {
        type: String,
        match: [/^https?:\/\//, 'Image must be a valid URL'], // Regex validation for URL format
    },
    // Timestamp for when the product was created
    createdAt: {
        type: Date,
        default: Date.now, // Automatically set to current date/time
    },
});

// Create and export the Product model
const Product = mongoose.model('Product', productSchema);

export default Product;