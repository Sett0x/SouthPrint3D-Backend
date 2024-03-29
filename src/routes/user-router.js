import express from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser
} from '../controllers/user-controller.js';
import { checkToken, isAdmin } from '../middlewares/auth-middleware.js';

const router = express.Router();
// router.use(checkToken); // REFACT

router.get('', checkToken, isAdmin, getUsers);

// Rutas para acceder y modificar el propio perfil del usuario
router.get('/:id', checkToken, getUserById);
router.patch('/:id', checkToken, updateUser); // Los usuarios pueden modificar su propio perfil
router.delete('/:id', checkToken, deleteUser); // Los usuarios pueden eliminar su propia cuenta
router.post('/register', createUser);

export default router;
