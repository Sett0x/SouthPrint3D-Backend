import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, minlength: 6 }, // Longitud mínima de la contraseña
  nombre: {
    name: { type: String, required: true },
    lastname: { type: String, required: true }
  },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true }, // Correo electrónico normalizado en minúsculas
  phone : { type: String, required: true, unique: true, minlength: 10, maxlength: 15 }, // Restricciones de longitud para el número de teléfono
  address: {
    state: { type: String, required: true },
    province: { type: String, required: true },
    city: { type: String, required: true },
    zipcode: { type: String, required: true },
    street: { type: String, required: true },
    number: { type: Number, required: true },
    floor: { type: String, required: false },
    apartment: { type: String, required: false}
  },
  role: { type: String, enum: ['admin', 'user'], default: 'user' }
}, { timestamps: true });

export default model('User', userSchema);
