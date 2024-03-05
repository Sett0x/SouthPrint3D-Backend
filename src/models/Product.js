import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const imageSchema = new Schema({
  url: { type: String, required: false },
  caption: { type: String }
});

const productSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  iva: { type: Number, default: 0.21 },
  totalPrice: { type: Number, required: false },
  discount: { type: Number, default: 0 },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  dimensions: {
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    depth: { type: Number, required: true }
  },
  averageRating: { type: Number, default: 0 },
  images: [{ type: String }],
}, { timestamps: true });

// Hook para calcular el totalPrice antes de guardar el producto
productSchema.pre('save', function (next) {
  this.totalPrice = this.price + (this.price * this.iva);
  next();
});

export default model('Product', productSchema);
