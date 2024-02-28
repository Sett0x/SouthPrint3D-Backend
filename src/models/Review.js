// review-model.js
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const reviewSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Referencia al usuario que dejó la reseña
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true }, // Referencia al producto de la reseña
  rating: { type: Number, required: true, min: 1, max: 5 }, // Valoración del producto (entre 1 y 5)
  comment: { type: String }, // Comentario del usuario sobre el producto
}, { timestamps: true });

export default model('Review', reviewSchema);
