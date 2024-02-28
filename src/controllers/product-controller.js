// Controladores de productos (product-controller.js)
import Product from '../models/product.js';


export async function getProducts(req, res) {
  const products = await Product.find();
  res.json(products);
}

export async function getProductById(req, res) {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.json(product);
}

export async function getProducts(req, res) {
  const { name, category, priceMin, priceMax } = req.query;
  let query = {};

  if (name) {
    query.name = { $regex: name, $options: 'i' }; // Búsqueda por nombre, con coincidencia parcial y sin distinción entre mayúsculas y minúsculas
  }

  if (category) {
    query.category = category; // Búsqueda por categoría
  }

  if (priceMin || priceMax) {
    query.price = {}; // Búsqueda por rango de precio
    if (priceMin) query.price.$gte = parseFloat(priceMin);
    if (priceMax) query.price.$lte = parseFloat(priceMax);
  }

  const products = await Product.find(query);
  res.json(products);
}


export async function createProduct(req, res) {
  const productData = req.body;
  const product = await Product.create(productData);
  res.status(201).json(product);
}

export async function updateProduct(req, res) {
  const { id } = req.params;
  const productData = req.body;
  const product = await Product.findByIdAndUpdate(id, productData, { new: true });
  res.json(product);
}

export async function deleteProduct(req, res) {
  const { id } = req.params;
  await Product.findByIdAndDelete(id);
  res.status(204).end();
}

export async function getProductsByCategory(req, res) {
  const { category } = req.params;
  const products = await Product.find({ category });
  res.json(products);
}
