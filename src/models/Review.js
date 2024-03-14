// models/review.js
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const reviewSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
}, { timestamps: true });

// Middleware para calcular y actualizar la media de puntuación del producto asociado
reviewSchema.post('save', async function(next) {
  try {
    const review = this;
    const totalRating = await model('Review').aggregate([
      { $match: { product: review.product } },
      { $group: { _id: null, total: { $sum: '$rating' }, count: { $sum: 1 } } }
    ]);

    const averageRating = totalRating[0].total / totalRating[0].count;

    // Actualizamos la media de puntuación del producto asociado a la reseña
    await model('Product').findByIdAndUpdate(review.product, { averageRating });
    next();
  } catch (error) {
    next(error);
  }
});

export default model('Review', reviewSchema);
