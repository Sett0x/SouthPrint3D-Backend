import Review from '../../models/review.js';
import logger from '../../utils/logger.js';
import { ValidationError } from 'common-errors';
import { body, validationResult } from 'express-validator';

// Reglas de validación para la creación de reseñas
const createReviewValidationRules = [
  body('user').notEmpty().withMessage('El ID de usuario es requerido'),
  body('product').notEmpty().withMessage('El ID del producto es requerido'),
  body('title').isLength({ min: 2, max: 30 }).withMessage('El título debe tener entre 2 y 30 caracteres'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('La calificación debe estar entre 1 y 5'),
  body('comment').isLength({ min: 10, max: 500 }).withMessage('El comentario debe tener entre 10 y 500 caracteres')
];

export async function getAllReviews() {
  try {
    const reviews = await Review.find().populate('user', 'username');
    return reviews;
  } catch (error) {
    logger.error(`Error al obtener todas las reseñas: ${error.message}`);
    throw new Error('Error al obtener todas las reseñas');
  }
}

export async function getProductReviews(productId) {
  try {
    const reviews = await Review.find({ product: productId }).populate('user', 'username');
    return reviews;
  } catch (error) {
    logger.error(`Error al obtener las reseñas del producto: ${error.message}`);
    throw new Error('Error al obtener las reseñas del producto');
  }
}

export async function createReview({ user, product, title, rating, comment }) {
  // Ejecutar las reglas de validación
  createReviewValidationRules.forEach(validation => validation.run(req));

  // Verificar si hay errores de validación
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError(errors.array());
  }

  try {
    const review = await Review.create({ user, product, title, rating, comment });
    return review;
  } catch (error) {
    logger.error(`Error al crear la reseña: ${error.message}`);
    throw new Error('Error al crear la reseña');
  }
}

export async function updateReview(id, { rating, comment }) {
  try {
    const review = await Review.findByIdAndUpdate(id, { rating, comment }, { new: true });
    if (!review) {
      throw new Error('Reseña no encontrada');
    }
    return review;
  } catch (error) {
    logger.error(`Error al actualizar la reseña: ${error.message}`);
    throw new Error('Error al actualizar la reseña');
  }
}

export async function deleteReview(id) {
  try {
    const review = await Review.findByIdAndDelete(id);
    if (!review) {
      throw new Error('Reseña no encontrada');
    }
  } catch (error) {
    logger.error(`Error al eliminar la reseña: ${error.message}`);
    throw new Error('Error al eliminar la reseña');
  }
}
