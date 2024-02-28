import express from 'express';
import { login } from '../controllers/login-controller.js';
import miscRouter from './misc-router.js';
import productsRouter from './product-router.js'; // Importa las rutas de productos

const router = express.Router();

router.post('/login', login);

router.use('/products', productsRouter); // Agrega las rutas de productos bajo el prefijo '/products'
router.use(miscRouter);

export default router;
