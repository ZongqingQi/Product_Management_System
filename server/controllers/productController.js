import mongoose from 'mongoose';
import Product from '../models/Product.js'

// GET /api/products -- get all products
export const getAllProducts = async (req, res) => {
  try {
    // Get pagination parameters
    const page = parseInt(req.query.page) || 1;        // Get page number from URL params (e.g. /api/products?page=2), default is page 1
    const limit = parseInt(req.query.limit) || 12;     // Items per page, default is 12
    const skip = (page - 1) * limit;                   // Calculate how many items to skip

    const { search } = req.query;
    let query = {};

    if (search) {    // If search parameter exists
      query = {     // Modify query object
        $or: [                           // $or - OR operator, match any condition (MongoDB syntax)
          { name: new RegExp(search, "i") },   // new RegExp(search, "i") - Create regex, "i" - case-insensitive
          { description: new RegExp(search, "i") },
        ],
      };
    }

    // Get total count
    const total = await Product.countDocuments(query);

    const products = await Product.find(query)
     .skip(skip)      // Skip previous items
     .limit(limit);   // Only take 'limit' number of items - MongoDB pagination method

    res.status(200).json({
      products,                          // Product data
      currentPage: page,                 // Current page number
      totalPages: Math.ceil(total / limit),  // Total pages, round up
      totalProducts: total               // Total number of products
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// POST /api/products -- add a new product
export const createProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

};

// GET /api/products/:id -- get a specific product
export const getProductById = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
    }

    try {
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ error: "Product not found" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT /api/products/:id -- update a specific product
export const updateProductById = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
    }

    try {
        const updated = await Product.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updated) return res.status(404).json({ error: "Product not found" });
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// DELETE /api/products/:id -- delete a specific product
export const deleteProductById = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
    }

    try {
        const deleted = await Product.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};