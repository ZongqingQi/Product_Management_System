import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const sampleProducts = [
  {
    name: "Wireless Mouse",
    description: "Ergonomic wireless mouse with long battery life",
    category: "Electronics",
    price: 25.99,
    quantity: 100,
    image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Running Shoes",
    description: "Lightweight and breathable shoes for everyday running",
    category: "Shoes",
    price: 59.99,
    quantity: 50,
    image: "https://images.unsplash.com/photo-1600180758890-6e0e1d5e22f6?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Bluetooth Headphones",
    description: "Noise-cancelling over-ear headphones with deep bass",
    category: "Electronics",
    price: 79.99,
    quantity: 40,
    image: "https://images.unsplash.com/photo-1585386959984-a4155228d3ec?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Classic Novel",
    description: "A timeless literary classic that belongs on every bookshelf",
    category: "Books",
    price: 14.5,
    quantity: 200,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Denim Jacket",
    description: "Stylish unisex denim jacket perfect for layering",
    category: "Clothing",
    price: 45.0,
    quantity: 30,
    image: "https://images.unsplash.com/photo-1618354691417-e0b27f2cdb06?auto=format&fit=crop&w=500&q=80",
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to DB');

    await Product.deleteMany({});
    console.log('🧹 Existing products deleted');

    await Product.insertMany(sampleProducts);
    console.log('🌱 Sample products inserted');

    process.exit();
  } catch (err) {
    console.error('❌ Error seeding data:', err);
    process.exit(1);
  }
};

seedDB();