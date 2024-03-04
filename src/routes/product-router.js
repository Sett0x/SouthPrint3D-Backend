import express from 'express';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory
} from '../controllers/product-controller.js';
import { isAdmin } from '../middlewares/auth-middleware.js';

const router = express.Router();

router.get('', getProducts);
router.post('', isAdmin, createProduct);
router.put('/:id', isAdmin, updateProduct);
router.delete('/:id', isAdmin, deleteProduct);
router.get('/category/:category', getProductsByCategory);

export default router;
