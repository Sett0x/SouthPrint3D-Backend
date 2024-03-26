// cart-controller.js

import { validationResult, body } from 'express-validator';
import * as CartDBService from '../services/database/cart-db-service.js';

// Definir reglas de validación para los campos del carrito
const validationRules = [
  body('userId').notEmpty().withMessage('Invalid userId'),
  body('productId').notEmpty().withMessage('Invalid productId'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
  // Agregar más reglas de validación según sea necesario
];

/**
 * Agrega un producto al carrito.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
export async function addToCart(req, res) {
  // Ejecutar las reglas de validación
  await Promise.all(validationRules.map(validation => validation.run(req)));

  // Verificar si hay errores de validación
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userId, productId, quantity } = req.body;
  try {
    await CartDBService.addToCart(userId, productId, quantity);
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
  // Ejecutar las reglas de validación
  await Promise.all(validationRules.slice(0, 2).map(validation => validation.run(req)));

  // Verificar si hay errores de validación
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

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
  // Ejecutar las reglas de validación
  await Promise.all(validationRules.slice(0, 2).concat(body('quantity').isInt({ min: 1 })).map(validation => validation.run(req)));

  // Verificar si hay errores de validación
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

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
  // Ejecutar las reglas de validación
  await Promise.all(validationRules.slice(0, 1).map(validation => validation.run(req)));

  // Verificar si hay errores de validación
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

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
  // Ejecutar las reglas de validación
  await Promise.all(validationRules.slice(0, 1).map(validation => validation.run(req)));

  // Verificar si hay errores de validación
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userId } = req.body;
  try {
    await CartDBService.clearCart(userId);
    res.status(200).json({ success: true, message: 'Cart cleared successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
