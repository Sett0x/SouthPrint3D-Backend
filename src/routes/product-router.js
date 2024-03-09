import express from 'express';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getProductById
} from '../controllers/product-controller.js';
import { isAdmin } from '../middlewares/auth-middleware.js';

const router = express.Router();

router.get('', getProducts);
router.post('', isAdmin, createProduct);
router.put('/:id', isAdmin, updateProduct);
router.delete('/:id', isAdmin, deleteProduct);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProductById);

export default router;
