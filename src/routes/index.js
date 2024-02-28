import express from 'express';
import { login, register } from '../controllers/auth-controller.js'; // Importar la función de registro
import miscRouter from './misc-router.js';
import productsRouter from './product-router.js';
import usersRouter from './user-router.js'; // Importa las rutas de usuarios

const router = express.Router();

router.post('/login', login);
router.post('/register', register); // Endpoint para el registro de nuevos usuarios

router.use('/products', productsRouter);
router.use('/users', usersRouter); // Agrega las rutas de usuarios bajo el prefijo '/users'
router.use(miscRouter);

export default router;
