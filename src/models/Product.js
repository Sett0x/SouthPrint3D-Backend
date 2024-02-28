import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const productSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  iva: { type: Number, default: 0.21 }, // Porcentaje del IVA (por defecto 21%)
  totalPrice: {
    type: Number,
    required: true,
    validate: {
      validator: function(value) {
        return value === this.basePrice * this.iva; // Comprueba que totalPrice sea igual a basePrice * (1 + iva)
      },
    },
  },
  discount: { type: Number, default: 0 }, // Por defecto, el descuento es 0
  stock: { type: Number, required: true },
  category: { type: String, required: true }, // Categoría del producto (ej. "casco", "espada", etc.)
  dimensions: {
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    depth: { type: Number, required: true }
  },
  averageRating: { type: Number, default: 0 },
  images: [{ type: String }], // Campo para almacenar las URLs de las imágenes

  /*
  order: {
    type: Boolean,
    default: false,
    required: true
  },
  detailsOrder: {
    color: {
      type: String,
      enum: ['rojo', 'azul', 'verde', 'amarillo', 'negro', 'blanco']
    },
    material: {
      type: String,
      enum: ['PLA+', 'PETG', 'TPU']
    },
    productionTime: { type: Number }
  }
  */

}, { timestamps: true });

// Define una función para determinar si detailsOrder es requerido o no
/*
productSchema.path('detailsOrder').required(function () {
  return this.order === true;
}, 'Detalles de encargo son requeridos si el producto es bajo encargo');
*/

export default model('product', productSchema);
