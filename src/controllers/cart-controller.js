import { validationResult, body } from 'express-validator';
import * as CartDBService from '../services/database/cart-db-service.js';
import * as OrderDBService from '../services/database/order-db-service.js';
import { errorMiddleware } from '../middlewares/error-middleware.js';

const validationRules = [
  body('userId').notEmpty().withMessage('Invalid userId'),
  body('productId').notEmpty().withMessage('Invalid productId'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
  // Agregar más reglas de validación según sea necesario
];

export async function addToCart(req, res) {
  await Promise.all(validationRules.map(validation => validation.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userId, productId, quantity } = req.body;
  try {
    await CartDBService.addToCart(userId, productId, quantity);
    res.status(200).json({ success: true, message: 'Product added to cart successfully' });
  } catch (error) {
    errorMiddleware(error, req, res);
  }
}

export async function removeFromCart(req, res) {
  await Promise.all(validationRules.slice(0, 2).map(validation => validation.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userId, productId } = req.body;
  try {
    await CartDBService.removeFromCart(userId, productId);
    res.status(200).json({ success: true, message: 'Product removed from cart successfully' });
  } catch (error) {
    errorMiddleware(error, req, res);
  }
}

export async function updateCartItemQuantity(req, res) {
  await Promise.all(validationRules.slice(0, 2).concat(body('quantity').isInt({ min: 1 })).map(validation => validation.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userId, productId, quantity } = req.body;
  try {
    await CartDBService.updateCartItemQuantity(userId, productId, quantity);
    res.status(200).json({ success: true, message: 'Cart item quantity updated successfully' });
  } catch (error) {
    errorMiddleware(error, req, res);
  }
}

export async function getCartItems(req, res) {
  await Promise.all(validationRules.slice(0, 1).map(validation => validation.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userId } = req.body;
  try {
    const cartItems = await CartDBService.getCartItems(userId);
    res.status(200).json({ success: true, cartItems });
  } catch (error) {
    errorMiddleware(error, req, res);
  }
}

export async function clearCart(req, res) {
  await Promise.all(validationRules.slice(0, 1).map(validation => validation.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userId } = req.body;
  try {
    await CartDBService.clearCart(userId);
    res.status(200).json({ success: true, message: 'Cart cleared successfully' });
  } catch (error) {
    errorMiddleware(error, req, res);
  }
}

export async function confirmOrder(req, res) {
  const { userId, shippingAddress } = req.body;
  try {
    const cartItems = await CartDBService.getCartItems(userId);
    if (cartItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    for (const item of cartItems) {
      const product = await ProductDBService.getProduct(item.productId);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ success: false, message: 'Insufficient stock for product ' + product.name });
      }
    }

    const order = await OrderDBService.createOrder(userId, cartItems, shippingAddress);
    await CartDBService.clearCart(userId);
    res.status(200).json({ success: true, order, message: 'Order confirmed successfully' });
  } catch (error) {
    errorMiddleware(error, req, res);
  }
}
