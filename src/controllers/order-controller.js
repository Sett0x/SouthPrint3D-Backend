// order-controller.js
import Order from '../models/order.js';
import User from '../models/user.js'; // Importar el modelo de usuario

// Obtener todos los pedidos del usuario autenticado
export async function getUserOrders(req, res) {
  const userId = req.user.id; // ID del usuario autenticado
  const orders = await Order.find({ userId });
  res.json(orders);
}

// Crear un nuevo pedido
export async function createOrder(req, res) {
  const userId = req.user.id; // ID del usuario autenticado

  try {
    // Obtener datos del usuario desde la base de datos
    const user = await User.findById(userId);

    // Verificar si el usuario existe
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Obtener los productos y la dirección de envío del cuerpo de la solicitud
    const { products, shippingAddress } = req.body;

    // Verificar si se proporcionaron productos
    if (!products || products.length === 0) {
      return res.status(400).json({ message: 'Debe proporcionar al menos un producto' });
    }

    // Verificar si la dirección de envío está presente
    if (!shippingAddress) {
      return res.status(400).json({ message: 'La dirección de envío es requerida' });
    }

    // Crear un nuevo pedido con los datos del usuario y los productos
    const order = await Order.create({ userId, products, shippingAddress });

    // Devolver el pedido creado
    res.status(201).json(order);
  } catch (error) {
    console.error('Error al crear el pedido:', error);
    res.status(500).json({ message: 'Error al crear el pedido' });
  }
}

// Obtener un pedido por su ID
export async function getOrderById(req, res) {
  const { id } = req.params;
  try {
    const order = await Order.findById(id);
    // Verificar si el pedido existe
    if (!order) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }
    // Verificar si el pedido pertenece al usuario autenticado
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Acceso no autorizado' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error al obtener el pedido por ID:', error);
    res.status(500).json({ message: 'Error al obtener el pedido' });
  }
}

// Actualizar el estado de un pedido
export async function updateOrderStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const order = await Order.findById(id);
    // Verificar si el pedido existe
    if (!order) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }
    // Verificar si el pedido pertenece al usuario autenticado
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Acceso no autorizado' });
    }
    // Actualizar el estado del pedido
    order.status = status;
    // Si el nuevo estado es "cancelado", eliminar el pedido
    if (status === 'cancelado') {
      await order.remove();
      return res.json({ message: 'Pedido cancelado y eliminado' });
    }
    // Guardar el pedido actualizado
    await order.save();
    res.json(order);
  } catch (error) {
    console.error('Error al actualizar el estado del pedido:', error);
    res.status(500).json({ message: 'Error al actualizar el estado del pedido' });
  }
}

// Función para buscar pedidos por diferentes parámetros
export async function searchOrders(req, res) {
  const { userId } = req.user; // ID del usuario autenticado

  // Extraer los parámetros de búsqueda del cuerpo de la solicitud
  const { fromDate, toDate, minTotalPrice, maxTotalPrice, productId } = req.query;

  // Crear un objeto de búsqueda con los parámetros proporcionados
  const searchQuery = { userId };
  if (fromDate && toDate) {
    searchQuery.date = { $gte: new Date(fromDate), $lte: new Date(toDate) };
  }
  if (minTotalPrice || maxTotalPrice) {
    searchQuery.totalPrice = {};
    if (minTotalPrice) searchQuery.totalPrice.$gte = parseFloat(minTotalPrice);
    if (maxTotalPrice) searchQuery.totalPrice.$lte = parseFloat(maxTotalPrice);
  }
  if (productId) {
    searchQuery['products.productId'] = productId;
  }

  try {
    // Buscar los pedidos que coincidan con los criterios de búsqueda
    const orders = await Order.find(searchQuery);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar pedidos' });
  }
}

// Eliminar un pedido
export async function deleteOrder(req, res) {
  const { id } = req.params;
  try {
    const order = await Order.findById(id);
    // Verificar si el pedido existe
    if (!order) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }
    // Verificar si el usuario tiene permiso para eliminar el pedido
    if (req.user.id !== order.userId.toString()) {
      return res.status(403).json({ message: 'Acceso no autorizado para eliminar el pedido' });
    }
    await order.remove();
    res.json({ message: 'Pedido eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el pedido:', error);
    res.status(500).json({ message: 'Error al eliminar el pedido' });
  }
}

// Obtener pedidos por estado
export async function getUserOrdersByStatus(req, res) {
  const userId = req.user.id;
  const { status } = req.params;
  try {
    const orders = await Order.find({ userId, status });
    res.json(orders);
  } catch (error) {
    console.error('Error al obtener pedidos por estado:', error);
    res.status(500).json({ message: 'Error al obtener pedidos por estado' });
  }
}

// Obtener historial de pedidos por fecha
export async function getOrderHistoryByDate(req, res) {
  const userId = req.user.id;
  // Obtener la fecha de inicio y fin del historial de pedidos
  const { fromDate, toDate } = req.query;
  try {
    const orders = await Order.find({
      userId,
      createdAt: { $gte: new Date(fromDate), $lte: new Date(toDate) }
    });
    res.json(orders);
  } catch (error) {
    console.error('Error al obtener historial de pedidos por fecha:', error);
    res.status(500).json({ message: 'Error al obtener historial de pedidos por fecha' });
  }
}

// Buscar productos en historial de pedidos
export async function searchOrderHistoryByProduct(req, res) {
  const userId = req.user.id;
  const { productName } = req.query;
  try {
    const orders = await Order.find({
      userId,
      'products.name': { $regex: productName, $options: 'i' }
    });
    res.json(orders);
  } catch (error) {
    console.error('Error al buscar productos en historial de pedidos:', error);
    res.status(500).json({ message: 'Error al buscar productos en historial de pedidos' });
  }
}
