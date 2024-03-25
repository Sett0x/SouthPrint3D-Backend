import express from 'express';
import { addToCart, removeFromCart } from '../controllers/cart-controller.js';

const router = express.Router();

router.post('/add', addToCart);
router.post('/remove', removeFromCart);

export default router;
