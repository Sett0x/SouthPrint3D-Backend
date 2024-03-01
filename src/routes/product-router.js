import express from 'express';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory
} from '../controllers/product-controller.js';
import { isAdmin } from '../middlewares/auth-middleware.js'; // Importar el middleware

const router = express.Router();

router.get('', getProducts);
router.post('', isAdmin, createProduct); // Aplicar el middleware isAdmin aquí
router.put('/:id', isAdmin, updateProduct); // Aplicar el middleware isAdmin aquí
router.delete('/:id', isAdmin, deleteProduct); // Aplicar el middleware isAdmin aquí
router.get('/category/:category', getProductsByCategory);

export default router;
