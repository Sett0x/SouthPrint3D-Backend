import * as ReviewService from '../services/database/review-db-service.js';

export async function getAllReviews(req, res) {
  try {
    const reviews = await ReviewService.getAllReviews();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getProductReviews(req, res) {
  const productId = req.params.productId;
  try {
    const reviews = await ReviewService.getProductReviews(productId);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Crear una nueva reseña vinculada a un producto
export async function createReview(req, res) {
  const { user, product, rating, comment } = req.body;
  try {
    // Aquí podrías realizar validaciones adicionales, como comprobar si el producto existe, etc.
    const review = await ReviewService.createReview({ user, product, rating, comment });
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Actualizar una reseña
export async function updateReview(req, res) {
  const { id } = req.params;
  const { rating, comment } = req.body;
  try {
    const review = await ReviewService.getReviewById(id);
    if (!review) {
      return res.status(404).json({ message: 'Reseña no encontrada' });
    }
    if (req.user.id !== review.user.toString()) {
      return res.status(403).json({ message: 'Acceso no autorizado para actualizar la reseña' });
    }
    review.rating = rating;
    review.comment = comment;
    await review.save();
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Eliminar una reseña
export async function deleteReview(req, res) {
  const { id } = req.params;
  try {
    const review = await ReviewService.getReviewById(id);
    if (!review) {
      return res.status(404).json({ message: 'Reseña no encontrada' });
    }
    if (req.user.id !== review.user.toString()) {
      return res.status(403).json({ message: 'Acceso no autorizado para eliminar la reseña' });
    }
    await ReviewService.deleteReview(id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
