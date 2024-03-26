import Cart from '../../models/cart.js';

/**
 * Agrega un producto al carrito.
 * @param {string} userId - ID del usuario.
 * @param {string} productId - ID del producto.
 */
export async function addToCart(userId, productId) {
  // Validar el userId y productId
  if (!isValidObjectId(userId)) {
    throw new ValidationError('Invalid userId');
  }
  if (!isValidObjectId(productId)) {
    throw new ValidationError('Invalid productId');
  }

  try {
    let cartItem = await Cart.findOne({ userId, productId });

    if (cartItem) {
      cartItem.quantity++;
    } else {
      cartItem = new Cart({ userId, productId });
    }

    await cartItem.save();
  } catch (error) {
    throw new DatabaseError('Error adding product to cart: ' + error.message);
  }
}

/**
 * Elimina un producto del carrito.
 * @param {string} userId - ID del usuario.
 * @param {string} productId - ID del producto.
 */
export async function removeFromCart(userId, productId) {
  // Validar el userId y productId
  if (!isValidObjectId(userId)) {
    throw new ValidationError('Invalid userId');
  }
  if (!isValidObjectId(productId)) {
    throw new ValidationError('Invalid productId');
  }

  try {
    const cartItem = await Cart.findOne({ userId, productId });

    if (cartItem) {
      if (cartItem.quantity > 1) {
        cartItem.quantity--;
        await cartItem.save();
      } else {
        await cartItem.remove();
      }
    }
  } catch (error) {
    throw new DatabaseError('Error removing product from cart: ' + error.message);
  }
}

/**
 * Actualiza la cantidad de un producto en el carrito.
 * @param {string} userId - ID del usuario.
 * @param {string} productId - ID del producto.
 * @param {number} quantity - Nueva cantidad del producto.
 */
export async function updateCartItemQuantity(userId, productId, quantity) {
  // Validar el userId y productId
  if (!isValidObjectId(userId)) {
    throw new ValidationError('Invalid userId');
  }
  if (!isValidObjectId(productId)) {
    throw new ValidationError('Invalid productId');
  }

  try {
    const cartItem = await Cart.findOne({ userId, productId });

    if (cartItem) {
      cartItem.quantity = quantity;
      await cartItem.save();
    }
  } catch (error) {
    throw new DatabaseError('Error updating cart item quantity: ' + error.message);
  }
}

/**
 * Obtiene todos los elementos del carrito de un usuario.
 * @param {string} userId - ID del usuario.
 * @returns {Array} - Array de elementos del carrito.
 */
export async function getCartItems(userId) {
  // Validar el userId
  if (!isValidObjectId(userId)) {
    throw new ValidationError('Invalid userId');
  }

  try {
    const cartItems = await Cart.find({ userId });
    return cartItems;
  } catch (error) {
    throw new DatabaseError('Error getting cart items: ' + error.message);
  }
}

/**
 * Elimina todos los elementos del carrito de un usuario.
 * @param {string} userId - ID del usuario.
 */
export async function clearCart(userId) {
  // Validar el userId
  if (!isValidObjectId(userId)) {
    throw new ValidationError('Invalid userId');
  }

  try {
    await Cart.deleteMany({ userId });
  } catch (error) {
    throw new DatabaseError('Error clearing cart: ' + error.message);
  }
}

/**
 * Función para validar si un ID es válido.
 * @param {string} id - ID a validar.
 * @returns {boolean} - true si el ID es válido, false de lo contrario.
 */
function isValidObjectId(id) {
  // Implementa aquí la lógica de validación del ObjectId.
  // Por ejemplo, puedes usar una función proporcionada por mongoose u otra biblioteca de validación.
  return mongoose.Types.ObjectId.isValid(id);
}
