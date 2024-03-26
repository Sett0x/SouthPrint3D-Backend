import { validationResult } from 'express-validator';
import * as CartDBService from '../services/database/cart-db-service.js';

/**
 * Agrega un producto al carrito.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
export async function addToCart(req, res) {
  const { userId, productId } = req.body;
  try {
    await CartDBService.addToCart(userId, productId);
    res.status(200).json({ success: true, message: 'Product added to cart successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

/**
 * Elimina un producto del carrito.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
export async function removeFromCart(req, res) {
  const { userId, productId } = req.body;
  try {
    await CartDBService.removeFromCart(userId, productId);
    res.status(200).json({ success: true, message: 'Product removed from cart successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

/**
 * Actualiza la cantidad de un producto en el carrito.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
export async function updateCartItemQuantity(req, res) {
  const { userId, productId, quantity } = req.body;
  try {
    await CartDBService.updateCartItemQuantity(userId, productId, quantity);
    res.status(200).json({ success: true, message: 'Cart item quantity updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

/**
 * Obtiene todos los elementos del carrito de un usuario.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
export async function getCartItems(req, res) {
  const { userId } = req.body;
  try {
    const cartItems = await CartDBService.getCartItems(userId);
    res.status(200).json({ success: true, cartItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

/**
 * Elimina todos los elementos del carrito de un usuario.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
export async function clearCart(req, res) {
  const { userId } = req.body;
  try {
    await CartDBService.clearCart(userId);
    res.status(200).json({ success: true, message: 'Cart cleared successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
