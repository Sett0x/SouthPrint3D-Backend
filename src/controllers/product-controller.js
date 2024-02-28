import Product from '../models/product.js';

export async function getProducts(req, res) {
  const { name, category, priceMin, priceMax } = req.query;
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
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos' });
  }
}

export async function createProduct(req, res) {
  const productData = req.body;
  try {
    const product = await Product.create(productData);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el producto' });
  }
}

export async function updateProduct(req, res) {
  const { id } = req.params;
  const productData = req.body;
  try {
    const product = await Product.findByIdAndUpdate(id, productData, { new: true });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el producto' });
  }
}

export async function deleteProduct(req, res) {
  const { id } = req.params;
  try {
    await Product.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ message: 'Error al eliminar el producto' });
  }
}

export async function getProductsByCategory(req, res) {
  const { category } = req.params;
  try {
    const products = await Product.find({ category });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos por categoría' });
  }
}
