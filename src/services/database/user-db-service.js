import bcrypt from 'bcrypt';
import User from '../../models/User.js';
import Product from '../../models/Product.js';
import Order from '../../models/Order.js';

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

// Funciones del carrito de compras

export async function addItemToCart(userId, productId) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    const productIndex = user.userCart.findIndex(cartItem => cartItem.toString() === productId);
    if (productIndex === -1) {
      user.userCart.push(productId);
      await user.save();
      return user;
    } else {
      throw new Error('El producto ya está en el carrito del usuario');
    }
  } catch (error) {
    throw new Error(`Error al añadir el producto al carrito: ${error.message}`);
  }
}

export async function removeItemFromCart(userId, productId) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const productIndex = user.userCart.indexOf(productId);
    if (productIndex !== -1) {
      user.userCart.splice(productIndex, 1);
      await user.save();
      return user;
    } else {
      throw new Error('El producto no está en el carrito del usuario');
    }
  } catch (error) {
    throw new Error(`Error al eliminar el producto del carrito: ${error.message}`);
  }
}

export async function clearCart(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    user.userCart = [];
    await user.save();
    return user;
  } catch (error) {
    throw new Error(`Error al vaciar el carrito: ${error.message}`);
  }
}

export async function getCart(userId) {
  try {
    const user = await User.findById(userId).populate('userCart');
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return user;
  } catch (error) {
    throw new Error(`Error al obtener el carrito: ${error.message}`);
  }
}

export async function confirmOrder(userId) {
  const discount = 0.8;

  try {
    const user = await User.findById(userId).populate('address').populate('userCart');

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const purchase = {
      userId: user._id,
      shippingAddress: user.address._id, // Utilizar el _id de la dirección del usuario
      products: [],
      totalPrice: 0
    };

    for (const product of user.userCart) {
      const productData = await Product.findById(product._id);

      if (!productData || productData.amount === 0) {
        throw new Error('El producto no tiene stock');
      }

      productData.amount -= 1;

      const item = {
        productId: productData._id,
        productName: productData.name,
        price: productData.price * discount
      };

      purchase.products.push(item);
      purchase.totalPrice = (parseFloat(purchase.totalPrice) + parseFloat(item.price)).toFixed(2);

      await productData.save();
    }

    const purchaseDoc = new Order(purchase);
    await purchaseDoc.save();

    user.userCart = [];
    await user.save();

    return user;
  } catch (error) {
    throw new Error(`Error al confirmar el pedido: ${error.message}`);
  }
}

// Función para obtener el historial de compras de un usuario
export async function getOrders(userId) {
  try {
    const purchases = await Order.find({ userId }).select('-__v -updatedAt');
    if (!purchases) {
      throw new Error('No se encontraron compras');
    }
    return purchases;
  } catch (error) {
    throw new Error(`Error al obtener el historial de compras: ${error.message}`);
  }
}
