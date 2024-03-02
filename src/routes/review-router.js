import express from 'express';
import { checkToken, isAdmin } from '../middlewares/auth-middleware.js'; // Importa el middleware de autenticación
import * as ReviewController from '../controllers/review-controller.js'; // Importa las funciones del controlador de reseñas

const router = express.Router();

// Rutas accesibles para todos los usuarios

// Endpoint para obtener todas las reseñas
router.get('',isAdmin ,ReviewController.getAllReviews);

// Endpoint para obtener todas las reseñas de un producto
router.get('/:productId', ReviewController.getProductReviews);

// Middleware de autenticación para garantizar que solo los usuarios autenticados puedan acceder a estas rutas
router.use(checkToken);

// Rutas accesibles solo para usuarios autenticados

// Endpoint para crear una nueva reseña
router.post('', ReviewController.createReview);

// Endpoint para actualizar una reseña existente
router.put('/:id', ReviewController.updateReview);

// Endpoint para eliminar una reseña existente
router.delete('/:id', ReviewController.deleteReview);

export default router;
