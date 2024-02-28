// review-controller.js
import Review from '../models/review.js';

// Obtener todas las reseñas
export async function getAllReviews(req, res) {
  try {
    const reviews = await Review.find().populate('user', 'username');
    res.json(reviews);
  } catch (error) {
    console.error('Error al obtener todas las reseñas:', error);
    res.status(500).json({ message: 'Error al obtener todas las reseñas' });
  }
}


// Obtener todas las reseñas de un producto
export async function getProductReviews(req, res) {
  const productId = req.params.productId;
  try {
    const reviews = await Review.find({ product: productId }).populate('user', 'username');
    res.json(reviews);
  } catch (error) {
    console.error('Error al obtener las reseñas del producto:', error);
    res.status(500).json({ message: 'Error al obtener las reseñas del producto' });
  }
}

// Crear una nueva reseña
export async function createReview(req, res) {
  const { user, product, rating, comment } = req.body;
  try {
    const review = await Review.create({ user, product, rating, comment });
    res.status(201).json(review);
  } catch (error) {
    console.error('Error al crear la reseña:', error);
    res.status(500).json({ message: 'Error al crear la reseña' });
  }
}

// Actualizar una reseña
export async function updateReview(req, res) {
  const { id } = req.params;
  const { rating, comment } = req.body;
  try {
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: 'Reseña no encontrada' });
    }
    // Verificar si el usuario tiene permiso para actualizar la reseña
    if (req.user.id !== review.user.toString()) {
      return res.status(403).json({ message: 'Acceso no autorizado para actualizar la reseña' });
    }
    review.rating = rating;
    review.comment = comment;
    await review.save();
    res.json(review);
  } catch (error) {
    console.error('Error al actualizar la reseña:', error);
    res.status(500).json({ message: 'Error al actualizar la reseña' });
  }
}

// Eliminar una reseña
export async function deleteReview(req, res) {
  const { id } = req.params;
  try {
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: 'Reseña no encontrada' });
    }
    // Verificar si el usuario tiene permiso para eliminar la reseña
    if (req.user.id !== review.user.toString()) {
      return res.status(403).json({ message: 'Acceso no autorizado para eliminar la reseña' });
    }
    await review.remove();
    res.json({ message: 'Reseña eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar la reseña:', error);
    res.status(500).json({ message: 'Error al eliminar la reseña' });
  }
}
