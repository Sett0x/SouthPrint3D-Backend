import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const orderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Referencia al usuario que realizó el pedido
  products: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true }, // Referencia al producto ordenado
    quantity: { type: Number, required: true }, // Cantidad del producto ordenado
    price: { type: Number, required: true } // Precio del producto en el momento del pedido
  }],
  date: { type: Date, default: Date.now }, // Fecha y hora en que se realizó el pedido
  status: { type: String, enum: ['pendiente', 'enviado', 'entregado'], default: 'pendiente' }, // Estado del pedido
  shippingAddress: { type: Schema.Types.ObjectId, ref: 'User.address', required: true } // Dirección de envío
}, { timestamps: true });

export default model('Order', orderSchema);
