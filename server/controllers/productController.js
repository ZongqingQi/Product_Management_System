import mongoose from 'mongoose';
import Product from '../models/Product.js'

// GET /api/products -- get all products
export const getAllProducts = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { name: new RegExp(search, "i") },
          { description: new RegExp(search, "i") },
        ],
      };
    }

    const products = await Product.find(query);
    res.status(200).json(products);
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