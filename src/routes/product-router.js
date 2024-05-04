import express from 'express';
import { isAdmin } from '../middlewares/auth-middleware.js';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getProductById,
  getHiddenProducts // Moved this up
} from '../controllers/product-controller.js';

const router = express.Router();

router.get('/hidden', isAdmin, getHiddenProducts); // Changed the order here
router.get('', getProducts);
router.post('', isAdmin, createProduct);
router.patch('/:id', isAdmin, updateProduct);
router.delete('/:id', isAdmin, deleteProduct);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProductById);

export default router;
