import express from 'express';
import miscRouter from './misc-router.js';
import productsRouter from './product-router.js';
import usersRouter from './user-router.js';
import ordersRouter from './order-router.js';
import reviewRouter from './review-router.js';
import { login } from '../controllers/login-controller.js';

const router = express.Router();

router.post('/login', login);

router.use('/products', productsRouter);
router.use('/users', usersRouter);
router.use('/orders', ordersRouter);
router.use('/reviews', reviewRouter);
router.use(miscRouter);

export default router;
