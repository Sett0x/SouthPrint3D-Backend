import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const addressSchema = new Schema({
  state: { type: String, required: true },
  province: { type: String, required: true },
  city: { type: String, required: true },
  zipcode: { type: String, required: true },
  street: { type: String, required: true },
  number: { type: Number, required: true },
  floor: { type: String, required: false },
  apartment: { type: String, required: false }
});

const userSchema = new Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  nombre: {
    name: { type: String, required: true },
    lastname: { type: String, required: true }
  },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  phone : { type: String, required: true, unique: true, minlength: 9, maxlength: 15 },
  address: { type: addressSchema, required: true },
  userCart: { type: [{ type: Schema.Types.ObjectId, ref: 'Product' }], default: [] },
  role: { type: String, enum: ['admin', 'user'], default: 'user' }
}, { timestamps: true });

export default model('User', userSchema);
