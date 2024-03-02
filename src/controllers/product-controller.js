import * as ProductDBService from '../services/database/product-db-service.js';

export async function getProducts(req, res) {
  const queryParams = req.query;
  try {
    const products = await ProductDBService.getProducts(queryParams);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function createProduct(req, res) {
  const productData = req.body;
  try {
    const product = await ProductDBService.createProduct(productData);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el producto' });
  }
}

export async function updateProduct(req, res) {
  const { id } = req.params;
  const productData = req.body;
  try {
    const product = await ProductDBService.updateProduct(id, productData);
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el producto' });
  }
}

export async function deleteProduct(req, res) {
  const { id } = req.params;
  try {
    await ProductDBService.deleteProduct(id);
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ message: 'Error al eliminar el producto' });
  }
}

export async function getProductsByCategory(req, res) {
  const { category } = req.params;
  try {
    const products = await ProductDBService.getProductsByCategory(category);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos por categoría' });
  }
}
