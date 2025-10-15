import express from 'express';
import {
  getAllProducts,
  createProduct,
  getProductById,
  updateProductById,
  deleteProductById
} from '../controllers/productController.js';

const router = express.Router();

// Create
router.post('/', createProduct);

// Read
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Update
router.put('/:id', updateProductById);

// Delete
router.delete('/:id', deleteProductById);

export default router;