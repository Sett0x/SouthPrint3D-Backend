import express from 'express';
import {
  getUserMe,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser
} from '../controllers/user-controller.js';
import { checkToken, isAdmin } from '../middlewares/auth-middleware.js';

const router = express.Router();

// Ruta para obtener el perfil del usuario actual
router.get('/me', checkToken, getUserMe);

// Rutas para obtener y modificar los usuarios
router.get('', checkToken, isAdmin, getUsers);
router.get('/:id', checkToken, getUserById);
router.patch('/:id', checkToken, updateUser);
router.delete('/:id', checkToken, deleteUser);
router.post('/register', createUser);

export default router;
