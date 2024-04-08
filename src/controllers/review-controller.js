import * as ReviewService from '../services/database/review-db-service.js';
import { body, validationResult } from 'express-validator';
import { ValidationError } from 'common-errors';
import logger from '../utils/logger.js';
import { errorMiddleware } from '../middlewares/error-middleware.js';

// Reglas de validación para la creación de reseñas
const createReviewValidationRules = [
  body('userId').notEmpty().withMessage('El ID de usuario es requerido'),
  body('productId').notEmpty().withMessage('El ID del producto es requerido'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('La calificación debe estar entre 1 y 5'),
  body('comment').isLength({ min: 10, max: 500 }).withMessage('El comentario debe tener entre 10 y 500 caracteres'),
  body('title').isLength({ min: 2, max: 30 }).withMessage('El título debe tener entre 2 y 30 caracteres')
];

export async function getAllReviews(req, res) {
  try {
    const reviews = await ReviewService.getAllReviews();
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    errorMiddleware(error, req, res); // Utilizar el middleware de manejo de errores
  }
}

export async function getProductReviews(req, res) {
  const productId = req.params.productId;
  try {
    const reviews = await ReviewService.getProductReviews(productId);
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    errorMiddleware(error, req, res); // Utilizar el middleware de manejo de errores
  }
}

export async function createReview(req, res) {
  // Ejecutar las reglas de validación
  createReviewValidationRules.forEach(validation => validation.run(req));

  // Verificar si hay errores de validación
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userId, productId, rating, comment, title } = req.body;

  try {
    const review = await ReviewService.createReview({ user: userId, product: productId, rating, comment, title });
    res.status(201).json({ success: true, data: review });
  } catch (error) {
    errorMiddleware(error, req, res); // Utilizar el middleware de manejo de errores
  }
}

export async function updateReview(req, res) {
  const { id } = req.params;
  const { rating, comment } = req.body;

  // Validar que la calificación esté dentro del rango válido (1-5)
  if (rating !== undefined && (rating < 1 || rating > 5)) {
    return res.status(400).json({ success: false, message: 'La calificación debe estar entre 1 y 5' });
  }

  try {
    const review = await ReviewService.getReviewById(id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Reseña no encontrada' });
    }

    if (req.user.id !== review.user.toString()) {
      return res.status(403).json({ success: false, message: 'Acceso no autorizado para actualizar la reseña' });
    }

    const updatedReview = await ReviewService.updateReview(id, { rating, comment });
    res.status(200).json({ success: true, data: updatedReview });
  } catch (error) {
    errorMiddleware(error, req, res); // Utilizar el middleware de manejo de errores
  }
}

export async function deleteReview(req, res) {
  const { id } = req.params;

  try {
    const review = await ReviewService.getReviewById(id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Reseña no encontrada' });
    }

    if (req.user.id !== review.user.toString()) {
      return res.status(403).json({ success: false, message: 'Acceso no autorizado para eliminar la reseña' });
    }

    await ReviewService.deleteReview(id);
    res.status(204).end();
  } catch (error) {
    errorMiddleware(error, req, res); // Utilizar el middleware de manejo de errores
  }
}
