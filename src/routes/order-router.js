// order-router.js
import express from 'express';
import {
  getUserOrders,
  createOrder,
  getOrderById,
  updateOrderStatus,
  searchOrders // Agrega la función para buscar pedidos
} from '../controllers/order-controller.js';
import { checkToken, isAdmin } from '../middlewares/auth-middleware.js';

const router = express.Router();

router.use(checkToken); // Middleware para verificar el token de autenticación

router.get('/orders', getUserOrders); // Obtener todos los pedidos del usuario
router.post('/orders', createOrder); // Crear un nuevo pedido
router.get('/orders/:id', getOrderById); // Obtener un pedido por su ID
router.put('/orders/:id/status', isAdmin, updateOrderStatus); // Actualizar el estado de un pedido
router.delete('/orders/:id', isAdmin, deleteOrder); // Eliminar un pedido cancelado
router.get('/orders/status/:status', getUserOrdersByStatus); // Obtener pedidos por estado
router.get('/orders/history', getOrderHistoryByDate); // Obtener historial de pedidos por fecha
router.get('/orders/history/search', searchOrderHistoryByProduct); // Buscar productos en historial de pedidos

export default router;
