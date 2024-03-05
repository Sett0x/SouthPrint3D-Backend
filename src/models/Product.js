import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const imageSchema = new Schema({
  url: { type: String, required: true }, // URL de la imagen
  caption: { type: String } // Leyenda opcional para la imagen
});

const productSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  iva: { type: Number, default: 0.21 }, // Porcentaje del IVA (por defecto 21%)
  totalPrice: {
    type: Number,
    required: false
  }, // Ahora se calculará automáticamente, así que no es necesario validar
  discount: { type: Number, default: 0 }, // Por defecto, el descuento es 0
  stock: { type: Number, required: true },
  category: { type: String, required: true }, // Categoría del producto (ej. "casco", "espada", etc.)
  dimensions: {
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    depth: { type: Number, required: true }
  },
  averageRating: { type: Number, default: 0 },
  images: [imageSchema], // Array de objetos de imagen

}, { timestamps: true });

export default model('Product', productSchema);
