import express from 'express';
import {
  getUserMe,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
  addItemToCart,
  removeItemFromCart,
  clearCart,
  getCart,
  confirmOrder,
  getOrders
} from '../controllers/user-controller.js';
import { checkToken, isAdmin } from '../middlewares/auth-middleware.js';

const router = express.Router();

// Ruta para obtener el perfil del usuario actual
router.get('/me', checkToken, getUserMe);

// Rutas para gestionar el carrito de compras
router.post('/cart/add/:productId', checkToken, addItemToCart); // Cambié la ruta para agregar productos al carrito y pasé el ID del producto en la URL
router.delete('/cart/remove/:productId', checkToken, removeItemFromCart); // Mantuve esta ruta para eliminar productos del carrito
router.delete('/cart/clear', checkToken, clearCart);
router.get('/cart', checkToken, getCart);

// Rutas para confirmar pedido y obtener historial de compras
router.post('/cart/confirm', checkToken, confirmOrder);
router.get('/getOrders', checkToken, getOrders);

// Rutas para obtener y modificar los usuarios
router.get('', checkToken, isAdmin, getUsers);
router.get('/:id', checkToken, getUserById);
router.patch('/:id', checkToken, updateUser);
router.delete('/:id', checkToken, deleteUser);
router.post('/register', createUser);

export default router;
