// order-controller.js
import Order from '../models/order.js';
import User from '../models/user.js'; // Importar el modelo de usuario
import * as OrderDBService from '../services/database/order-db-service.js';

// Obtener todos los pedidos del usuario autenticado
export async function getUserOrders(req, res) {
  try {
    const orders = await OrderDBService.getUserOrders(req.user.id);
    res.json(orders);
  } catch (error) {
    console.error('Error al obtener los pedidos del usuario:', error);
    res.status(500).json({ message: 'Error al obtener los pedidos del usuario' });
  }
}

// Crear un nuevo pedido
export async function createOrder(req, res) {
  try {
    const order = await OrderDBService.createOrder(req.user.id, req.body.products, req.body.shippingAddress);
    res.status(201).json(order);
  } catch (error) {
    console.error('Error al crear el pedido:', error);
    res.status(500).json({ message: 'Error al crear el pedido' });
  }
}

// Obtener un pedido por su ID
export async function getOrderById(req, res) {
  try {
    const order = await OrderDBService.getOrderById(req.params.id, req.user.id);
    res.json(order);
  } catch (error) {
    console.error('Error al obtener el pedido por ID:', error);
    res.status(500).json({ message: 'Error al obtener el pedido por ID' });
  }
}

// Actualizar el estado de un pedido
export async function updateOrderStatus(req, res) {
  try {
    const order = await OrderDBService.updateOrderStatus(req.params.id, req.user.id, req.body.status);
    res.json(order);
  } catch (error) {
    console.error('Error al actualizar el estado del pedido:', error);
    res.status(500).json({ message: 'Error al actualizar el estado del pedido' });
  }
}

// Función para buscar pedidos por diferentes parámetros
export async function searchOrders(req, res) {
  try {
    const orders = await OrderDBService.searchOrders(req.user.id, req.query);
    res.json(orders);
  } catch (error) {
    console.error('Error al buscar pedidos:', error);
    res.status(500).json({ message: 'Error al buscar pedidos' });
  }
}

// Eliminar un pedido
export async function deleteOrder(req, res) {
  try {
    await OrderDBService.deleteOrder(req.params.id, req.user.id);
    res.json({ message: 'Pedido eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el pedido:', error);
    res.status(500).json({ message: 'Error al eliminar el pedido' });
  }
}

// Obtener pedidos por estado
export async function getUserOrdersByStatus(req, res) {
  try {
    const orders = await OrderDBService.getUserOrdersByStatus(req.user.id, req.params.status);
    res.json(orders);
  } catch (error) {
    console.error('Error al obtener pedidos por estado:', error);
    res.status(500).json({ message: 'Error al obtener pedidos por estado' });
  }
}

// Obtener historial de pedidos por fecha
export async function getOrderHistoryByDate(req, res) {
  try {
    const orders = await OrderDBService.getOrderHistoryByDate(req.user.id, req.query);
    res.json(orders);
  } catch (error) {
    console.error('Error al obtener historial de pedidos por fecha:', error);
    res.status(500).json({ message: 'Error al obtener historial de pedidos por fecha' });
  }
}

// Buscar productos en historial de pedidos
export async function searchOrderHistoryByProduct(req, res) {
  try {
    let productName = req.query.productName;

    // Verificar si productName no es una cadena de texto
    if (typeof productName !== 'string') {
      // Intentar convertir productName a cadena de texto
      productName = String(productName);
    }

    // Realizar la consulta a la base de datos utilizando productName
    const orders = await OrderDBService.searchOrderHistoryByProduct(req.user.id, productName);
    res.json(orders);
  } catch (error) {
    console.error('Error al buscar productos en historial de pedidos:', error);
    res.status(500).json({ message: 'Error al buscar productos en historial de pedidos' });
  }
}

