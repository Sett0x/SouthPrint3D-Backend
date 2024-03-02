// user-db-service.js
import bcrypt from 'bcrypt';
import User from '../../models/user.js';

export async function getUsers(filters) {
  try {
    const query = buildQuery(filters);
    const users = await User.find(query);
    return users;
  } catch (error) {
    throw new Error('Error al obtener los usuarios');
  }
}

export async function getUserById(id) {
  try {
    const user = await User.findById(id);
    return user;
  } catch (error) {
    throw new Error('Error al obtener el usuario');
  }
}

export async function createUser(data) {
  try {
    const { username, password, email, address, phone, nombre } = data;

    // Verificar si ya existe un usuario con el mismo nombre de usuario
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      throw new Error('El nombre de usuario ya está en uso');
    }

    // Encriptar la contraseña antes de almacenarla en la base de datos
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear un nuevo usuario con los datos proporcionados
    const newUser = await User.create({
      username,
      password: hashedPassword,
      email,
      address,
      phone,
      nombre,
      role: 'user'
    });

    return newUser;
  } catch (error) {
    throw new Error('Error al registrar usuario: ' + error.message);
  }
}

export async function updateUser(id, userData) {
  try {
    const user = await User.findByIdAndUpdate(id, userData, { new: true });
    return user;
  } catch (error) {
    throw new Error('Error al actualizar el usuario');
  }
}

export async function deleteUser(id) {
  try {
    await User.findByIdAndDelete(id);
  } catch (error) {
    throw new Error('Error al eliminar el usuario');
  }
}

function buildQuery(filters) {
  const query = {};

  if (filters.username) {
    query.username = { $regex: new RegExp(filters.username, 'i') };
  }

  if (filters.name) {
    const { firstName, lastName } = filters.name;
    if (firstName) {
      query['nombre.name'] = { $regex: new RegExp(firstName, 'i') };
    }
    if (lastName) {
      query['nombre.lastname'] = { $regex: new RegExp(lastName, 'i') };
    }
  }

  if (filters.email) {
    query.email = { $regex: new RegExp(filters.email, 'i') };
  }

  if (filters.phone) {
    query.phone = { $regex: new RegExp(filters.phone, 'i') };
  }

  if (filters.state) {
    query['address.state'] = { $regex: new RegExp(filters.state, 'i') };
  }

  if (filters.province) {
    query['address.province'] = { $regex: new RegExp(filters.province, 'i') };
  }

  if (filters.city) {
    query['address.city'] = { $regex: new RegExp(filters.city, 'i') };
  }

  if (filters.zipcode) {
    query['address.zipcode'] = { $regex: new RegExp(filters.zipcode, 'i') };
  }

  if (filters.street) {
    query['address.street'] = { $regex: new RegExp(filters.street, 'i') };
  }

  if (filters.role) {
    query.role = filters.role;
  }

  return query;
}
