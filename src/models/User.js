import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nombre: {
    name: { type: String, required: true },
    lastname: { type: String, required: true }
  },
  email: { type: String, required: true, unique: true},
  phone : { type: String, required: true, unique: true},
  address: {
    state: { type: String, required: true },
    province: { type: String, required: true },
    city: { type: String, required: true },
    zipcode: { type: String, required: true },
    street: { type: String, required: true },
    number: { type: Number, required: true },
    floor: { type: String, required: false },
    apartment: { type: String, required: false}

  }

}, { timestamps: true });

export default model('User', userSchema);
