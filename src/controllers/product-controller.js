import * as ProductDBService from '../services/database/product-db-service.js';
import { validationResult, body } from 'express-validator';

export async function getProducts(req, res, next) {
  const queryParams = req.query;
  try {
    const products = await ProductDBService.getProducts(queryParams);
    res.json(products);
  } catch (error) {
    next(error); // Pasar el error al siguiente middleware
  }
}

export async function getProductById(req, res, next) {
  const { id } = req.params;
  try {
    const product = await ProductDBService.getProductById(id);
    if (!product) {
      throw new ValidationError('Producto no encontrado');
    }
    res.json(product);
  } catch (error) {
    next(error); // Pasar el error al siguiente middleware
  }
}

export async function createProduct(req, res) {
  // Definir reglas de validación para los campos del producto
  const validationRules = [
    body('name').notEmpty().withMessage('El nombre del producto es requerido'),
    body('description').notEmpty().withMessage('La descripción del producto es requerida'),
    body('price').isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),
    body('stock').isInt({ min: 0 }).withMessage('El stock debe ser un número entero positivo'),
    body('category').notEmpty().withMessage('La categoría del producto es requerida'),
    // Agregar más reglas de validación según sea necesario
  ];

  // Ejecutar las reglas de validación
  await Promise.all(validationRules.map(validation => validation.run(req)));

  // Verificar si hay errores de validación
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const productData = req.body;
  try {
    const product = await ProductDBService.createProduct(productData);
    res.status(201).json(product);
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(400).json({ message: 'Error al crear el producto: ' + error.message });
  }
}

export async function updateProduct(req, res) {
  const { id } = req.params;
  const productData = req.body;
  try {
    const product = await ProductDBService.updateProduct(id, productData);
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el producto: ' + error.message });
  }
}

export async function deleteProduct(req, res) {
  const { id } = req.params;
  try {
    await ProductDBService.deleteProduct(id);
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ message: 'Error al eliminar el producto: ' + error.message });
  }
}

export async function getProductsByCategory(req, res) {
  const { category } = req.params;

  // Validar si la categoría es una cadena no vacía
  if (!category || typeof category !== 'string') {
    return res.status(400).json({ message: 'La categoría proporcionada no es válida.' });
  }

  try {
    const products = await ProductDBService.getProductsByCategory(category);

    // Verificar si se encontraron productos
    if (products.length === 0) {
      return res.status(404).json({ message: 'No se encontraron productos para la categoría especificada.' });
    }

    res.json(products);
  } catch (error) {
    // Devolver un error más específico en caso de fallo
    res.status(500).json({ message: 'Error al obtener los productos por categoría.', error: error.message });
  }
}
