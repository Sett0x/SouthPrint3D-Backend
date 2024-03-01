// review-router.js
import express from 'express';
import { isAdmin } from '../middlewares/auth-middleware.js'; // Importa el middleware de autorización
import {
  createReview,
  updateReview,
  deleteReview,
  getAllReviews,
  getProductReviews
} from '../controllers/review-controller.js'; // Importa los controladores de reseñas

const router = express.Router();

// Rutas accesibles para usuarios administradores

// Endpoint para crear una nueva reseña
router.post('', isAdmin, createReview);

// Endpoint para actualizar una reseña existente
router.put('/:id', isAdmin, updateReview);

// Endpoint para eliminar una reseña existente
router.delete('/:id', isAdmin, deleteReview);

// Endpoint para obtener todas las reseñas
router.get('', isAdmin, getAllReviews);

// Rutas accesibles para todos los usuarios

// Endpoint para obtener todas las reseñas de un producto
router.get('/:productId', getProductReviews);

export default router;
