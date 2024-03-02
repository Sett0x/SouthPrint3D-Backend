// order-db-service.js
import Order from '../../models/order.js';

export async function getUserOrders(userId) {
  return await Order.find({ userId });
}

export async function createOrder(userId, products, shippingAddress) {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  if (!products || products.length === 0) {
    throw new Error('Debe proporcionar al menos un producto');
  }

  if (!shippingAddress) {
    throw new Error('La dirección de envío es requerida');
  }

  return await Order.create({ userId, products, shippingAddress });
}

export async function getOrderById(orderId, userId) {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error('Pedido no encontrado');
  }
  if (order.userId.toString() !== userId) {
    throw new Error('Acceso no autorizado');
  }
  return order;
}

export async function updateOrderStatus(orderId, userId, status) {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error('Pedido no encontrado');
  }
  if (order.userId.toString() !== userId) {
    throw new Error('Acceso no autorizado');
  }
  order.status = status;
  if (status === 'cancelado') {
    await order.remove();
    return { message: 'Pedido cancelado y eliminado' };
  }
  await order.save();
  return order;
}

export async function searchOrders(userId, query) {
  const searchQuery = { userId };
  if (query.fromDate && query.toDate) {
    searchQuery.date = { $gte: new Date(query.fromDate), $lte: new Date(query.toDate) };
  }
  if (query.minTotalPrice || query.maxTotalPrice) {
    searchQuery.totalPrice = {};
    if (query.minTotalPrice) searchQuery.totalPrice.$gte = parseFloat(query.minTotalPrice);
    if (query.maxTotalPrice) searchQuery.totalPrice.$lte = parseFloat(query.maxTotalPrice);
  }
  if (query.productId) {
    searchQuery['products.productId'] = query.productId;
  }
  return await Order.find(searchQuery);
}

export async function deleteOrder(orderId, userId) {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error('Pedido no encontrado');
  }
  if (userId !== order.userId.toString()) {
    throw new Error('Acceso no autorizado para eliminar el pedido');
  }
  await order.remove();
}

export async function getUserOrdersByStatus(userId, status) {
  return await Order.find({ userId, status });
}

export async function getOrderHistoryByDate(userId, query) {
  return await Order.find({
    userId,
    createdAt: { $gte: new Date(query.fromDate), $lte: new Date(query.toDate) }
  });
}

export async function searchOrderHistoryByProduct(userId, productName) {
  return await Order.find({
    userId,
    'products.name': { $regex: productName, $options: 'i' }
  });
}
