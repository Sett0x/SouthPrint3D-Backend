// Middleware para calcular el precio total del pedido
orderSchema.pre('save', async function(next) {
  try {
    const order = this;
    order.products.forEach(product => {
      product.price = product.productId.totalPrice * product.quantity;
    });
    next();
  } catch (error) {
    next(error);
  }
});
