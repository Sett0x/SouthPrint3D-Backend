import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const orderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  shippingAddress: { type: Schema.Types.ObjectId, ref: 'User.address', required: true },
  products: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true },
    price: { type: Number, required: true }
  }],
  totalPrice: { type: Number, required: true }
}, { timestamps: true });

export default model('Order', orderSchema);
