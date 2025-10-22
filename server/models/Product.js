import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: [true, 'Product name is required'],
        trim: true,
    },
    description: {
        type: String,
        default: '',
    },
    category: {
        type: String,
        enum: {
            values: ['Electronics', 'Clothing & Accessories', 'Books & Stationery', 'Clothing', 'Sports', 'Home'],
            message: '{VALUE} is not a valid category',
        },
        required: [true, 'Product category is required'],
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price must be a positive number'],
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [0, 'Quantity cannot be negative'],
        default: 0,
        validate: {
            validator: Number.isInteger,
            message: 'Quantity must be an integer',
        },
    },
    image: {
        type: String,
        match: [/^https?:\/\//, 'Image must be a valid URL'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Product = mongoose.model('Product', productSchema);

export default Product;