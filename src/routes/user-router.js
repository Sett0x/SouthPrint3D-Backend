import express from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/user-controller.js';
import { checkToken, isAdmin } from '../middlewares/auth-middleware.js';

const router = express.Router();

// Esta ruta solo será accesible para los administradores autenticados
router.get('/users', checkToken, isAdmin, getUsers);

// Rutas para acceder y modificar el propio perfil del usuario
router.get('/users/:id', checkToken, getUserById);
router.put('/users/:id', checkToken, updateUser); // Los usuarios pueden modificar su propio perfil
router.delete('/users/:id', checkToken, deleteUser); // Los usuarios pueden eliminar su propia cuenta

export default router;
