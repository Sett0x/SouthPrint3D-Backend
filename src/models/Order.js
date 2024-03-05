import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const orderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  totalPrice: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['pendiente', 'enviado', 'entregado'], default: 'pendiente' },
  shippingAddress: { type: Schema.Types.ObjectId, ref: 'User.address', required: true }
}, { timestamps: true });

// Middleware para calcular el precio total del pedido antes de guardarlo
orderSchema.pre('save', async function(next) {
  try {
    const order = this;
    let totalPrice = 0;
    order.products.forEach(product => {
      // Calculamos el precio total del producto multiplicando su precio total por la cantidad
      product.price = product.productId.totalPrice * product.quantity;
      // Sumamos el precio total de este producto al precio total del pedido
      totalPrice += product.price;
    });
    // Asignamos el precio total del pedido al campo correspondiente en el pedido
    order.totalPrice = totalPrice;
    next();
  } catch (error) {
    next(error);
  }
});

export default model('Order', orderSchema);
