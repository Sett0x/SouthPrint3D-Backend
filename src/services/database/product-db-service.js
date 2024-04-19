import Product from '../../models/product.js';

export async function getProducts(queryParams) {
  const { id, name, category, priceMin, priceMax, minStock } = queryParams;
  let query = {};

  if (id) {
    query._id = id;
  }

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

  if (minStock) {
    query.stock = { $gte: parseInt(minStock) };
  }

  try {
    const products = await Product.find(query);
    return products;
  } catch (error) {
    throw new Error('Error al obtener los productos: ' + error.message);
  }
}

export async function createProduct(productData) {
  try {
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
    throw new Error('Error al actualizar el producto: ' + error.message);
  }
}

export async function deleteProduct(id) {
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    return deletedProduct; // Devuelve el producto eliminado
  } catch (error) {
    throw new Error('Error al eliminar el producto: ' + error.message);
  }
}

export async function getProductsByCategory(category) {
  try {
    const products = await Product.find({ category: { $regex: new RegExp(category, 'i') } });
    return products;
  } catch (error) {
    throw new Error('Error al obtener los productos por categoría: ' + error.message);
  }
}

export async function getProductById(id) {
  try {
    const product = await Product.findById(id);
    if (!product) {
      throw new ValidationError('Producto no encontrado');
    }
    return product;
  } catch (error) {
    throw new Error('Error al obtener el producto por ID: ' + error.message);
  }
}
