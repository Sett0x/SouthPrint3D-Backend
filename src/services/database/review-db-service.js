import Review from '../../models/review.js';

export async function getAllReviews() {
  try {
    const reviews = await Review.find().populate('user', 'username');
    return reviews;
  } catch (error) {
    throw new Error('Error al obtener todas las reseñas');
  }
}

export async function getProductReviews(productId) {
  try {
    const reviews = await Review.find({ product: productId }).populate('user', 'username');
    return reviews;
  } catch (error) {
    throw new Error('Error al obtener las reseñas del producto');
  }
}

export async function createReview({ user, product, rating, comment }) {
  try {
    const review = await Review.create({ user, product, rating, comment });
    return review;
  } catch (error) {
    throw new Error('Error al crear la reseña');
  }
}

export async function updateReview(id, { rating, comment }) {
  try {
    const review = await Review.findById(id);
    if (!review) {
      throw new Error('Reseña no encontrada');
    }
    review.rating = rating;
    review.comment = comment;
    await review.save();
    return review;
  } catch (error) {
    throw new Error('Error al actualizar la reseña');
  }
}

export async function deleteReview(id) {
  try {
    const review = await Review.findById(id);
    if (!review) {
      throw new Error('Reseña no encontrada');
    }
    await review.remove();
  } catch (error) {
    throw new Error('Error al eliminar la reseña');
  }
}
