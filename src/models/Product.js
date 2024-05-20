import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const productSchema = new Schema({
  show: { type: Boolean, default: true },
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  iva: { type: Number, default: 0.21, min: 0 },
  totalPrice: { type: Number, required: false },
  ivaPrice: { type: Number, required: false },
  discount: { type: Number, default: 0, min: 0, max: 100 },
  stock: { type: Number, required: true, min: 0 },
  categories: [{ type: String, required: true, maxlength: 50 }],
  dimensions: {
    width: { type: Number, required: true, min: 0 },
    height: { type: Number, required: true, min: 0 },
    depth: { type: Number, required: true, min: 0 }
  },
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  images: [{ type: String, required: true }],
}, { timestamps: true });

// Definir el índice de texto completo en los campos 'name', 'description' y 'categories'
productSchema.index({ name: 'text', description: 'text', categories: 'text' });

// Hook para calcular el totalPrice & ivaPrice antes de guardar el producto
productSchema.pre('save', function (next) {
  this.totalPrice = this.price + (this.price * this.iva);

  this.ivaPrice = this.price * this.iva;
  next();
});

// Método personalizado para buscar productos por categoría
productSchema.statics.findByCategory = function (category) {
  return this.find({ categories: { $regex: new RegExp(category, 'i') } });
};

export default model('Product', productSchema);
