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
router.get('', checkToken, isAdmin, getUsers);

// Rutas para acceder y modificar el propio perfil del usuario
router.get('/:id', checkToken, getUserById);
router.put('/:id', checkToken, updateUser); // Los usuarios pueden modificar su propio perfil
router.delete('/:id', checkToken, deleteUser); // Los usuarios pueden eliminar su propia cuenta

export default router;
