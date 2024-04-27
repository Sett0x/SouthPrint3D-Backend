import Order from '../../models/order.js';

export async function getUserOrders(userId, page = 1, perPage = 10) {
  const skip = (page - 1) * perPage;
  return await Order.find({ userId })
    .skip(skip)
    .limit(perPage);
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

export async function searchOrders(userId, query, page = 1, perPage = 10) {
  const searchQuery = { userId };

  // Filtrado por fecha
  if (query.fromDate && query.toDate) {
    searchQuery.date = { $gte: new Date(query.fromDate), $lte: new Date(query.toDate) };
  }

  // Filtrado por precio total
  if (query.minTotalPrice || query.maxTotalPrice) {
    searchQuery.totalPrice = {};
    if (query.minTotalPrice) searchQuery.totalPrice.$gte = parseFloat(query.minTotalPrice);
    if (query.maxTotalPrice) searchQuery.totalPrice.$lte = parseFloat(query.maxTotalPrice);
  }

  // Filtrado por producto
  if (query.productId) {
    searchQuery['products.productId'] = query.productId;
  }

  try {
    const totalCount = await Order.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalCount / perPage);
    const currentPage = Math.min(Math.max(page, 1), totalPages);

    const orders = await Order.find(searchQuery)
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    return {
      currentPage,
      totalPages,
      totalCount,
      perPage,
      orders
    };
  } catch (error) {
    throw new Error('Error al buscar pedidos: ' + error.message);
  }
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
