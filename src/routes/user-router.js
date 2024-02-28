import express from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/user-controller.js';
import { isAdmin } from '../middlewares/auth-middleware.js';

const router = express.Router();

// Los usuarios normales no tienen acceso a esta ruta
router.get('/users', isAdmin, getUsers);

// Rutas para acceder y modificar el propio perfil del usuario
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;
