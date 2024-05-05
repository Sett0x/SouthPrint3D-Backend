import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const productSchema = new Schema({
  show: { type: Boolean, default: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  iva: { type: Number, default: 0.21, min: 0 },
  totalPrice: { type: Number, required: false }, // Precio total sin descuento + IVA
  priceWithDiscount: { type: Number, required: false }, // Precio con descuento
  totalPriceWithDiscount: { type: Number, required: false }, // Precio total con descuento + IVA
  ivaPrice: { type: Number, required: false }, // Monto del IVA aplicado al priceWithDiscount
  ivaForTotalPrice: { type: Number, required: false }, // Monto del IVA aplicado al totalPrice
  discount: { type: Number, default: 0, min: 0, max: 100 }, // Campo para el descuento
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

// Hook para calcular los precios y el IVA antes de guardar el producto
productSchema.pre('save', function (next) {
  // Calcular el precio total sin descuento + IVA
  this.totalPrice = this.price + (this.price * this.iva);

  // Calcular el precio con descuento y precio total con descuento solo si hay un descuento aplicado
  if (this.discount > 0) {
    const discountAmount = this.price * (this.discount / 100);
    this.priceWithDiscount = this.price - discountAmount;
    this.totalPriceWithDiscount = this.priceWithDiscount + (this.priceWithDiscount * this.iva);
    this.ivaPrice = parseFloat((this.totalPriceWithDiscount - this.priceWithDiscount).toFixed(2));
    this.ivaForTotalPrice = parseFloat((this.totalPrice - this.price).toFixed(2));
  }else {
    // Si no hay descuento, solo calculamos el IVA para el totalPrice
    this.ivaForTotalPrice = parseFloat((this.price * this.iva).toFixed(2)); // Corregido aquí
  }

  next();
});

// Método personalizado para buscar productos por categoría
productSchema.statics.findByCategory = function (category) {
  return this.find({ categories: { $regex: new RegExp(category, 'i') } });
};

export default model('Product', productSchema);
