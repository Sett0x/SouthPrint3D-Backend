import express from 'express';
import { addToCart, removeFromCart, updateCartItemQuantity, getCartItems, clearCart, confirmOrder } from '../controllers/cart-controller.js';
import { checkToken } from '../middlewares/auth-middleware.js';

const router = express.Router();

router.post('/add', checkToken, addToCart);
router.post('/remove', checkToken, removeFromCart);
router.patch('/updateQuantity', checkToken, updateCartItemQuantity);
router.get('/', checkToken, getCartItems);
router.delete('/clear', checkToken, clearCart);
router.post('/confirmOrder', checkToken, confirmOrder);


export default router;
