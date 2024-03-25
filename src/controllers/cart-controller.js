import Cart from '../models/cart.js';

export const addToCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const existingCartItem = await Cart.findOne({ userId, productId });

    if (existingCartItem) {
      // Si el producto ya está en el carrito, incrementa la cantidad
      existingCartItem.quantity++;
      await existingCartItem.save();
    } else {
      // Si el producto no está en el carrito, crea un nuevo elemento en el carrito
      await Cart.create({ userId, productId });
    }

    res.status(200).json({ success: true, message: 'Product added to cart successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;
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

    res.status(200).json({ success: true, message: 'Product removed from cart successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
