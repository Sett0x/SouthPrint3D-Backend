// Middleware para calcular y actualizar la media de puntuación
productSchema.pre('save', async function(next) {
  try {
    const product = this;
    const reviews = await Review.find({ product: product._id });
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
      product.averageRating = totalRating / reviews.length;
    } else {
      product.averageRating = 0;
    }
    next();
  } catch (error) {
    next(error);
  }
});
