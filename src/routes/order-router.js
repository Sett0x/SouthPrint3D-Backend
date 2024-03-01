// order-router.js
import express from 'express';
import {
  getUserOrders,
  createOrder,
  getOrderById,
  updateOrderStatus,
  searchOrders, // Agrega la función para buscar pedidos
  deleteOrder, // Agrega la función para eliminar un pedido
  getUserOrdersByStatus, // Agrega la función para obtener pedidos por estado
  getOrderHistoryByDate, // Agrega la función para obtener historial de pedidos por fecha
  searchOrderHistoryByProduct // Agrega la función para buscar productos en historial de pedidos
} from '../controllers/order-controller.js';
import { checkToken, isAdmin } from '../middlewares/auth-middleware.js';

const router = express.Router();

router.use(checkToken); // Middleware para verificar el token de autenticación

router.get('', getUserOrders); // Obtener todos los pedidos del usuario
router.post('', createOrder); // Crear un nuevo pedido
router.get('/:id', getOrderById); // Obtener un pedido por su ID
router.put('/:id/status', isAdmin, updateOrderStatus); // Actualizar el estado de un pedido
router.delete('/:id', isAdmin, deleteOrder); // Eliminar un pedido cancelado
router.get('/status/:status', getUserOrdersByStatus); // Obtener pedidos por estado
router.get('/history', getOrderHistoryByDate); // Obtener historial de pedidos por fecha
router.get('/history/search', searchOrderHistoryByProduct); // Buscar productos en historial de pedidos

export default router;
