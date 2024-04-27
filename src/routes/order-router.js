import express from 'express';
import {
  getUserOrders,
  createOrder,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  searchOrders,
} from '../controllers/order-controller.js';
import { checkToken, isAdmin } from '../middlewares/auth-middleware.js';

const router = express.Router();

router.use(checkToken);

router.get('/', getUserOrders);
router.post('/', createOrder);
router.get('/:id', getOrderById);
router.patch('/:id/status', isAdmin, updateOrderStatus); // Cambiado de 'put' a 'patch'
router.delete('/:id', isAdmin, deleteOrder);
router.get('/search', searchOrders); // Endpoint para buscar órdenes

export default router;
