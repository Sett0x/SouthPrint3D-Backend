import * as UserService from '../services/database/user-db-service.js';
import { validationResult, body } from 'express-validator';

// Definir reglas de validación para los campos del usuario
const validationRules = [
  body('username').notEmpty().withMessage('El nombre de usuario es requerido'),
  body('password').notEmpty().withMessage('La contraseña es requerida').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('email').isEmail().withMessage('El formato del correo electrónico no es válido'),
  body('phone').isNumeric().withMessage('El teléfono debe ser un número').isLength({ min: 9 }).withMessage('El teléfono debe tener al menos 9 dígitos'),
  body('nombre.name').notEmpty().withMessage('El nombre es requerido'),
  body('nombre.lastname').notEmpty().withMessage('El apellido es requerido'),
  body('address.state').notEmpty().withMessage('El estado es requerido'),
  body('address.province').notEmpty().withMessage('La provincia es requerida'),
  body('address.city').notEmpty().withMessage('La ciudad es requerida'),
  body('address.zipcode').notEmpty().withMessage('El código postal es requerido'),
  body('address.street').notEmpty().withMessage('La calle es requerida'),
  body('address.number').notEmpty().withMessage('El número es requerido').isInt().withMessage('El número debe ser un valor entero'),
];

export async function getUsers(req, res) {
  const { page = 1, perPage = 10, ...queryParams } = req.query;

  try {
    const users = await UserService.getUsers(queryParams, parseInt(page), parseInt(perPage));
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getUserById(req, res, next) {
  const { id } = req.params;
  try {
    const user = await UserService.getUserById(id);
    if (!user) {
      throw new ValidationError('Usuario no encontrado');
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
}

export async function getUserMe(req, res, next) {
  try {
    const userId = req.user.id;
    const user = await UserService.getUserById(userId);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


export async function updateUser(req, res) {
  const { id } = req.params;
  const userData = req.body;
  try {
    const user = await UserService.updateUser(id, userData);
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function createUser(req, res, next) {
  // Ejecutar las reglas de validación
  await Promise.all(validationRules.map(validation => validation.run(req)));

  // Verificar si hay errores de validación
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password, email, address, phone, nombre } = req.body;
  try {
    // Crear un nuevo usuario con los datos proporcionados
    const newUser = await UserService.createUser({
      username,
      password,
      email,
      address,
      phone,
      nombre
    });

    res.status(201).json(newUser);
  } catch (error) {
    // Manejo de errores
    next(error);
  }
}

export async function deleteUser(req, res) {
  const { id } = req.params;
  try {
    await UserService.deleteUser(id);
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Funciones del carrito de compras

export async function addItemToCart(req, res) {
  const userId = req.user.id;
  const { productId } = req.params;

  try {
    const user = await UserService.addItemToCart(userId, productId);
    const populatedUser = await UserService.getCart(userId); // Usar la función getCart para obtener el carrito completo
    res.json(populatedUser.userCart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function removeItemFromCart(req, res) {
  const userId = req.user.id;
  const { productId } = req.params;

  try {
    await UserService.removeItemFromCart(userId, productId);
    const populatedUser = await UserService.getCart(userId); // Usar la función getCart para obtener el carrito completo
    res.json(populatedUser.userCart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function clearCart(req, res) {
  const userId = req.user.id;

  try {
    await UserService.clearCart(userId);
    const populatedUser = await UserService.getCart(userId); // Usar la función getCart para obtener el carrito completo
    res.json(populatedUser.userCart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function getCart(req, res) {
  const userId = req.user.id;

  try {
    const user = await UserService.getCart(userId);
    res.json(user.userCart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Nueva función para confirmar el pedido
export async function confirmOrder(req, res) {
  const userId = req.user.id;
  const { address } = req.body;

  try {
    const user = await UserService.confirmOrder(userId, address);
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Nueva función para obtener el historial de compras
export async function getOrders(req, res) {
  const userId = req.user.id;

  try {
    const purchases = await UserService.getOrders(userId);
    res.json(purchases);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
