// controllers/review-controller.js
import * as ReviewService from '../services/database/review-db-service.js';
import { ValidationError } from 'common-errors';

import logger from '../utils/logger.js';

export async function getAllReviews(req, res) {
  try {
    const reviews = await ReviewService.getAllReviews();
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    logger.error(`Error al obtener todas las reseñas: ${error.message}`);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
}

export async function getProductReviews(req, res) {
  const productId = req.params.productId;
  try {
    const reviews = await ReviewService.getProductReviews(productId);
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    logger.error(`Error al obtener las reseñas del producto: ${error.message}`);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
}

export async function createReview(req, res) {
  const { productId, rating, comment } = req.body;
  const userId = req.user.id;

  try {
    const review = await ReviewService.createReview({ user: userId, product: productId, rating, comment });
    res.status(201).json({ success: true, data: review });
  } catch (error) {
    logger.error(`Error al crear la reseña: ${error.message}`);
    if (error instanceof ValidationError) {
      res.status(400).json({ success: false, message: error.message });
    } else {
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }
}

export async function updateReview(req, res) {
  const { id } = req.params;
  const { rating, comment } = req.body;

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
    logger.error(`Error al actualizar la reseña: ${error.message}`);
    if (error instanceof ValidationError) {
      res.status(400).json({ success: false, message: error.message });
    } else {
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
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
    logger.error(`Error al eliminar la reseña: ${error.message}`);
    if (error instanceof ValidationError) {
      res.status(400).json({ success: false, message: error.message });
    } else {
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }
}
