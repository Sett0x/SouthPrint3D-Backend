import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const productSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  iva: { type: Number, required: true },
  discount: { type: Number, default: 0 }, // Por defecto, el descuento es 0
  stock: { type: Number, required: true },
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

}, { timestamps: true });

// Define una función para determinar si detailsOrder es requerido o no
productSchema.path('detailsOrder').required(function () {
  return this.order === true;
}, 'Detalles de encargo son requeridos si el producto es bajo encargo');

export default model('Product', productSchema);
