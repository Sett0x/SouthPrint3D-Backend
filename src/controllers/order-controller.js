// order-controller.js
import * as OrderDBService from '../services/database/order-db-service.js';

export async function getUserOrders(req, res) {
  const userId = req.user.id;
  const { page = 1, perPage = 10 } = req.query;
  try {
    const result = await OrderDBService.getUserOrders(userId, page, perPage);
    res.json(result);
  } catch (error) {
    console.error('Error al obtener los pedidos del usuario:', error);
    res.status(500).json({ message: 'Error al obtener los pedidos del usuario' });
  }
}

export async function createOrder(req, res) {
  try {
    const order = await OrderDBService.createOrder(req.user.id, req.body.products, req.body.shippingAddress);
    // Limpiar el carrito después de crear la orden
    await OrderDBService.clearCart(req.user.id);
    res.status(201).json(order);
  } catch (error) {
    console.error('Error al crear el pedido:', error);
    res.status(500).json({ message: 'Error al crear el pedido' });
  }
}

export async function getOrderById(req, res) {
  try {
    const order = await OrderDBService.getOrderById(req.params.id, req.user.id);
    res.json(order);
  } catch (error) {
    console.error('Error al obtener el pedido por ID:', error);
    res.status(500).json({ message: 'Error al obtener el pedido por ID' });
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const order = await OrderDBService.updateOrderStatus(req.params.id, req.user.id, req.body.status);
    res.json(order);
  } catch (error) {
    console.error('Error al actualizar el estado del pedido:', error);
    res.status(500).json({ message: 'Error al actualizar el estado del pedido' });
  }
}

export async function searchOrders(req, res) {
  const userId = req.user.id;
  const { query, page = 1, perPage = 10 } = req.query;
  try {
    const result = await OrderDBService.searchOrders(userId, query, page, perPage);
    res.json(result);
  } catch (error) {
    console.error('Error al buscar pedidos:', error);
    res.status(500).json({ message: 'Error al buscar pedidos' });
  }
}

export async function deleteOrder(req, res) {
  try {
    await OrderDBService.deleteOrder(req.params.id, req.user.id);
    res.json({ message: 'Pedido eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el pedido:', error);
    res.status(500).json({ message: 'Error al eliminar el pedido' });
  }
}

// Eliminar getUserOrdersByStatus, getOrderHistoryByDate, searchOrderHistoryByProduct si no se utilizan
