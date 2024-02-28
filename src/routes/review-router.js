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
router.post('/review', isAdmin, createReview);

// Endpoint para actualizar una reseña existente
router.put('/review/:id', isAdmin, updateReview);

// Endpoint para eliminar una reseña existente
router.delete('/review/:id', isAdmin, deleteReview);

// Endpoint para obtener todas las reseñas
router.get('/review', isAdmin, getAllReviews);

// Rutas accesibles para todos los usuarios

// Endpoint para obtener todas las reseñas de un producto
router.get('/review/:productId', getProductReviews);

export default router;
