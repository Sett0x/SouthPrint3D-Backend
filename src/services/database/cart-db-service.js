import Cart from '../models/cart.js';

export async function addToCart(userId, productId) {
  try {
    const existingCartItem = await Cart.findOne({ userId, productId });

    if (existingCartItem) {
      // Si el producto ya está en el carrito, incrementa la cantidad
      existingCartItem.quantity++;
      await existingCartItem.save();
    } else {
      // Si el producto no está en el carrito, crea un nuevo elemento en el carrito
      await Cart.create({ userId, productId });
    }
  } catch (error) {
    throw new Error('Error adding product to cart');
  }
}

export async function removeFromCart(userId, productId) {
  try {
    const existingCartItem = await Cart.findOne({ userId, productId });

    if (existingCartItem) {
      if (existingCartItem.quantity > 1) {
        // Si la cantidad del producto es mayor que 1, disminuye la cantidad
        existingCartItem.quantity--;
        await existingCartItem.save();
      } else {
        // Si la cantidad del producto es 1, elimina el elemento del carrito
        await existingCartItem.remove();
      }
    }
  } catch (error) {
    throw new Error('Error removing product from cart');
  }
}
