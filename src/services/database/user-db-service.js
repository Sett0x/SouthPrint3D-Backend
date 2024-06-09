// user-db-service.js
import bcrypt from 'bcrypt';
import User from '../../models/User.js';

export async function getUsers(queryParams, page = 1, perPage = 10) {
  const { username, email, phone, state, province, city, zipcode, role, sortField, sortOrder } = queryParams;
  let query = {};

  if (username) {
    query.username = { $regex: new RegExp(username, 'i') };
  }

  if (email) {
    query.email = { $regex: new RegExp(email, 'i') };
  }

  if (phone) {
    query.phone = { $regex: new RegExp(phone, 'i') };
  }

  if (state) {
    query['address.state'] = { $regex: new RegExp(state, 'i') };
  }

  if (province) {
    query['address.province'] = { $regex: new RegExp(province, 'i') };
  }

  if (city) {
    query['address.city'] = { $regex: new RegExp(city, 'i') };
  }

  if (zipcode) {
    query['address.zipcode'] = { $regex: new RegExp(zipcode, 'i') };
  }

  if (role) {
    query.role = role;
  }

  try {
    let usersQuery = User.find(query).collation({ locale: 'en', strength: 2 });

    if (sortField && sortOrder) {
      const sortOptions = { [sortField]: sortOrder === 'asc' ? 1 : -1 };
      usersQuery = usersQuery.sort(sortOptions);
    }

    const totalCount = await User.countDocuments(query);
    const totalPages = Math.ceil(totalCount / perPage);
    const currentPage = Math.min(Math.max(page, 1), totalPages);

    const users = await usersQuery
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .exec();

    return {
      currentPage,
      totalPages,
      totalCount,
      perPage,
      users
    };
  } catch (error) {
    throw new Error(`Error al obtener los usuarios: ${error.message}`);
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
    // Captura errores específicos y lanza errores personalizados
    if (error.code === 11000) {
      throw new Error('El correo electrónico o nombre de usuario ya está en uso');
    } else {
      throw new Error('Error al registrar usuario');
    }
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

export async function getUserById(id) {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('El usuario no existe');
    }
    return user;
  } catch (error) {
    throw new Error(`Error al obtener el usuario por ID: ${error.message}`);
  }
}
