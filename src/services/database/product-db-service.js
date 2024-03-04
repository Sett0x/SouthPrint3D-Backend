import Product from '../../models/product.js';

export async function getProducts(queryParams) {
  const { name, category, priceMin, priceMax } = queryParams;
  let query = {};

  if (name) {
    query.name = { $regex: name, $options: 'i' };
  }

  if (category) {
    query.category = category;
  }

  if (priceMin || priceMax) {
    query.price = {};
    if (priceMin) query.price.$gte = parseFloat(priceMin);
    if (priceMax) query.price.$lte = parseFloat(priceMax);
  }

  try {
    const products = await Product.find(query);
    return products;
  } catch (error) {
    throw new Error('Error al obtener los productos');
  }
}

export async function createProduct(productData) {
  try {
    const product = await Product.create(productData);
    return product;
  } catch (error) {
    throw new Error('Error al crear el producto');
  }
}

export async function updateProduct(id, productData) {
  try {
    const product = await Product.findByIdAndUpdate(id, productData, { new: true });
    return product;
  } catch (error) {
    throw new Error('Error al actualizar el producto');
  }
}

export async function deleteProduct(id) {
  try {
    await Product.findByIdAndDelete(id);
  } catch (error) {
    throw new Error('Error al eliminar el producto');
  }
}

export async function getProductsByCategory(category) {
  try {
    const products = await Product.find({ category });
    return products;
  } catch (error) {
    throw new Error('Error al obtener los productos por categoría');
  }
}
