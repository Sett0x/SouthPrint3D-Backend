import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory
} from '../controllers/product-controller.js';
import { isAdmin } from '../middlewares/auth-middleware.js'; // Importar el middleware

const router = express.Router();

router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.post('/products', isAdmin, createProduct); // Aplicar el middleware isAdmin aquí
router.put('/products/:id', isAdmin, updateProduct); // Aplicar el middleware isAdmin aquí
router.delete('/products/:id', isAdmin, deleteProduct); // Aplicar el middleware isAdmin aquí
router.get('/products/category/:category', getProductsByCategory);

export default router;
