import express from 'express';
import {
  getUserOrders,
  createOrder,
  getOrderById,
  updateOrderStatus,
  searchOrders, // Agrega la función para buscar pedidos
  deleteOrder,
  getUserOrdersByStatus,
  getOrderHistoryByDate,
  searchOrderHistoryByProduct
} from '../controllers/order-controller.js';
import { checkToken, isAdmin } from '../middlewares/auth-middleware.js';

const router = express.Router();

router.use(checkToken);

router.get('', getUserOrders);
router.post('', createOrder);
router.get('/:id', getOrderById);
router.put('/:id/status', isAdmin, updateOrderStatus);
router.delete('/:id', isAdmin, deleteOrder);
router.get('/status/:status', getUserOrdersByStatus);
router.get('/history', getOrderHistoryByDate);
router.get('/history/search', searchOrderHistoryByProduct);

export default router;
