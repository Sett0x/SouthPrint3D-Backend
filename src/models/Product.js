import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const productSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  iva: { type: Number, default: 0.21, min: 0 },
  totalPrice: { type: Number, required: false },
  ivaPrice: { type: Number, required: false },
  discount: { type: Number, default: 0, min: 0, max: 100 },
  stock: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },
  dimensions: {
    width: { type: Number, required: true, min: 0 },
    height: { type: Number, required: true, min: 0 },
    depth: { type: Number, required: true, min: 0 }
  },
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  images: [{ type: String, required: true }],
}, { timestamps: true });

// Hook para calcular el totalPrice antes de guardar el producto
productSchema.pre('save', function (next) {
  this.totalPrice = this.price + (this.price * this.iva);

  this.ivaPrice = this.price * this.iva;
  next();
});

export default model('Product', productSchema);
