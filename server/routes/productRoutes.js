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
  .post(protect, adminOnly, createProduct); // ✅ 仅管理员

router.route('/:id')
  .get(getProductById)
  .put(protect, adminOnly, updateProductById) // ✅ 仅管理员
  .delete(protect, adminOnly, deleteProductById); // ✅ 仅管理员

export default router;
