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
    image: "https://webobjects2.cdw.com/is/image/CDW/2429821",
  },
  {
    name: "Running Shoes",
    description: "Lightweight and breathable shoes for everyday running",
    category: "Shoes",
    price: 59.99,
    quantity: 50,
    image: "https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1741716872-puma-foreverrun-nitro-2-67d07d7915584.jpg",
  },
  {
    name: "Bluetooth Headphones",
    description: "Noise-cancelling over-ear headphones with deep bass",
    category: "Electronics",
    price: 79.99,
    quantity: 40,
    image: "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6408/6408357_rd.jpg",
  },
  {
    name: "Classic Novel",
    description: "A timeless literary classic that belongs on every bookshelf",
    category: "Books",
    price: 14.5,
    quantity: 200,
    image: "https://images.squarespace-cdn.com/content/v1/604ffb544c6d436ffc845808/085b0e6a-10b7-4d70-b58d-6b6c5cd76810/classic-literature.jpg",
  },
  {
    name: "Denim Jacket",
    description: "Stylish unisex denim jacket perfect for layering",
    category: "Clothing",
    price: 45.0,
    quantity: 30,
    image: "https://schaeferoutfitter.com/cdn/shop/files/8000_legend-denim-jacket_MI_front1.jpg",
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