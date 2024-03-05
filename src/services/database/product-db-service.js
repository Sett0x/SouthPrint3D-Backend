import Product from '../../models/product.js';
import mongoose from 'mongoose';

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
    // Generar un nuevo ID para el producto
    const productId = new mongoose.Types.ObjectId();
    // Asignar el ID al producto
    productData._id = productId;
    // Crear el producto en la base de datos
    const product = await Product.create(productData);
    return product;
  } catch (error) {
    console.error('Error al crear el producto:', error);
    throw new Error('Error al crear el producto: ' + error.message);
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
