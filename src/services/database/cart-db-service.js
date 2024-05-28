import Cart from '../../models/Cart.js';
import Product from '../../models/Product.js';
import mongoose from 'mongoose';

export async function addToCart(userId, productId, quantity) {
  if (!isValidObjectId(userId)) {
    throw new ValidationError('Invalid userId');
  }
  if (!isValidObjectId(productId)) {
    throw new ValidationError('Invalid productId');
  }
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new ValidationError('Quantity must be a positive integer');
  }

  try {
    let cartItem = await Cart.findOne({ userId, productId });

    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cartItem = new Cart({ userId, productId, quantity });
    }

    await cartItem.save();

    await updateCartTotalPrice(userId);

  } catch (error) {
    throw new DatabaseError('Error adding product to cart: ' + error.message);
  }
}

export async function removeFromCart(userId, productId) {
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

    await updateCartTotalPrice(userId);

  } catch (error) {
    throw new DatabaseError('Error removing product from cart: ' + error.message);
  }
}

export async function updateCartItemQuantity(userId, productId, quantity) {
  if (!isValidObjectId(userId)) {
    throw new ValidationError('Invalid userId');
  }
  if (!isValidObjectId(productId)) {
    throw new ValidationError('Invalid productId');
  }
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new ValidationError('Quantity must be a positive integer');
  }

  try {
    const cartItem = await Cart.findOne({ userId, productId });

    if (cartItem) {
      cartItem.quantity = quantity;
      await cartItem.save();
    }

    await updateCartTotalPrice(userId);

  } catch (error) {
    throw new DatabaseError('Error updating cart item quantity: ' + error.message);
  }
}

export async function getCartItems(userId) {
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

export async function clearCart(userId) {
  if (!isValidObjectId(userId)) {
    throw new ValidationError('Invalid userId');
  }

  try {
    await Cart.deleteMany({ userId });
    await updateCartTotalPrice(userId);

  } catch (error) {
    throw new DatabaseError('Error clearing cart: ' + error.message);
  }
}

async function updateCartTotalPrice(userId) {
  try {
    const cartItems = await Cart.find({ userId });
    let totalCartPrice = 0;
    const productIds = cartItems.map(cartItem => cartItem.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    for (const cartItem of cartItems) {
      const product = products.find(p => p._id.equals(cartItem.productId));
      if (product) {
        totalCartPrice += product.totalPrice * cartItem.quantity;
      }
    }

    await Cart.updateOne({ userId }, { totalPrice: totalCartPrice });

  } catch (error) {
    throw new DatabaseError('Error updating cart total price: ' + error.message);
  }
}

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}
