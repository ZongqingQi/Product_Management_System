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
    category: "Clothing & Accessories",
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
    category: "Books & Stationery",
    price: 14.5,
    quantity: 200,
    image: "https://images.squarespace-cdn.com/content/v1/604ffb544c6d436ffc845808/085b0e6a-10b7-4d70-b58d-6b6c5cd76810/classic-literature.jpg",
  },
  {
    name: "Denim Jacket",
    description: "Stylish unisex denim jacket perfect for layering",
    category: "Clothing & Accessories",
    price: 45.0,
    quantity: 30,
    image: "https://schaeferoutfitter.com/cdn/shop/files/8000_legend-denim-jacket_MI_front1.jpg",
  },
  {
    name: "Smart Watch",
    description: "Water-resistant smartwatch with heart rate and sleep tracking",
    category: "Electronics",
    price: 129.99,
    quantity: 60,
    image: "https://target.scene7.com/is/image/Target/GUEST_d2dc275c-bd7d-47a6-be93-3a36488009b7",
  },
  {
    name: "Yoga Mat",
    description: "Non-slip exercise mat made of eco-friendly material",
    category: "Sports",
    price: 22.99,
    quantity: 120,
    image: "https://fbres.fivebelow.com/image/upload/t_large/product/9182965_01.jpg",
  },
  {
    name: "Leather Wallet",
    description: "Compact leather wallet with RFID protection and multiple slots",
    category: "Clothing & Accessories",
    price: 34.99,
    quantity: 80,
    image: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTarP1_8XrCnXTyQh-wOauKoLqXv3_3sUsuz-s05QhFMhBkqExi4DI3XQi3D0-zf6bmgbUz_pnYDWCv77mF0Wyd8KXPfPnxWzMJVN6ON5Z3QoyXPPpuZJVRCw",
  },
  {
    name: "Desk Lamp",
    description: "Adjustable LED desk lamp with touch control and USB charging port",
    category: "Home",
    price: 39.99,
    quantity: 70,
    image: "https://cdn-images.article.com/products/SKU2177/2890x1500/image171059.jpg",
  },
  {
    name: "Ceramic Mug",
    description: "12oz ceramic coffee mug with minimalist design",
    category: "Home",
    price: 12.99,
    quantity: 150,
    image: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTFvdgfuw4bPRizx0pOOTukjmXgOnAr_2XhT8_p1BYkgwcR1Go3l5IvUkgsp3hdRdS6prEuwtmKF40iBNQ7aV80NtCBulDOKhgHmBL2drmwdDrUe1HPm7lcAw",
  },
  {
    name: "Wireless Keyboard",
    description: "Slim rechargeable Bluetooth keyboard with quiet keys",
    category: "Electronics",
    price: 49.99,
    quantity: 90,
    image: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTy8GTJC1ZjRV7TrJM1oH420yprBNet5BVbLq3LYhdZ5HbOq2B9s5_K8VDlNYn-ARdS9PfUpPXuoAjInnbs5vDyj2W14Hk1-w",
  },
  {
    name: "Travel Backpack",
    description: "Waterproof 30L backpack with multiple compartments and laptop sleeve",
    category: "Clothing & Accessories",
    price: 69.99,
    quantity: 45,
    image: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcS51_13BxUdAcPJi3kKTjBzGV7PzYrbgscnPPdsIC3COy3h-0Md-WJH1OU35bUXQE1mX1ZTSOzBL7-oAvQsGZ9gK7CBCUjOeI6TufxyItotacQBjdUG67FAhI_lXzaPaTuT_b4dwmY&usqp=CAc",
  },
  {
    name: "Mechanical Pencil Set",
    description: "Set of premium mechanical pencils with 0.5mm lead and erasers",
    category: "Books & Stationery",
    price: 9.99,
    quantity: 250,
    image: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSFLEwUmDh5eVMXwNZ1CoxCC2sCBWEqyMR9nBFN1whPskZg7aN92wjzCDuHgDXyKsR9peZOLXCmrQVICqdxWBQWWP73JXWTQTbE7V1hNLKbZBm6gR09UIgsmA",
  },
  {
    name: "Cotton T-Shirt",
    description: "Soft 100% cotton T-shirt available in multiple colors",
    category: "Clothing & Accessories",
    price: 19.99,
    quantity: 100,
    image: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQwSmriAGrIq4grxmJ1h4vm56tNw5cDLEaVWqsTrNdMMxuZZeGqCOHBDmR3xsN5ry4-c-mrleX-PQXxOii7gRqrZSjIUDWnNm8e7TFpjOZRBVGcSZk19ip08d4gXSywBXFH5X3vCz4&usqp=CAc",
  },
  {
    name: "Gaming Chair",
    description: "Ergonomic gaming chair with adjustable armrests and lumbar support",
    category: "Home",
    price: 189.99,
    quantity: 25,
    image: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRwXlQxWSirFKaY5vVz_fTR3kmLPbbU9q9IoOgfOPa8-llEmiO47xN5bSDQTZVc0I2QU5Ufd4OfkbSUvpSHY5wSS0QJ1NF6zLkkn6dTUGtuBJEUI08hSwz1J9oTBLcZvA&usqp=CAc",
  },
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