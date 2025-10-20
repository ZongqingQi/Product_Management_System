import express from 'express';
import {
  getAllProducts,
  createProduct,
  getProductById,
  updateProductById,
  deleteProductById,
} from '../controllers/productController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getAllProducts)
  .post(protect, adminOnly, createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, adminOnly, updateProductById)
  .delete(protect, adminOnly, deleteProductById);

export default router;
