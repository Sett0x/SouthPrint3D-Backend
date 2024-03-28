import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const cartSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    {
      productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, default: 1 }
    }
  ],
  totalPrice: { type: Number, default: 0 }
});

export default model('Cart', cartSchema);
