import express from 'express';
import { login, register } from '../controllers/auth-controller.js'; // Importar la función de registro
import miscRouter from './misc-router.js';
import productsRouter from './product-router.js';
import usersRouter from './user-router.js'; // Importa las rutas de usuarios
import ordersRouter from './order-router.js'; // Importa las rutas de pedidos
import reviewRouter from './review-router.js'; // Importa las rutas de reseñas

const router = express.Router();

router.post('/login', login);
router.post('/register', register); // Endpoint para el registro de nuevos usuarios

router.use('/products', productsRouter);
router.use('/users', usersRouter); // Agrega las rutas de usuarios bajo el prefijo '/users'
router.use('/orders', ordersRouter); // Agrega las rutas de pedidos bajo el prefijo '/orders'
router.use('/reviews', reviewRouter); // Usa el enrutador de reseñas
router.use(miscRouter);

export default router;
