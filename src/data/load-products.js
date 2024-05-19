import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Obtener el directorio actual del archivo en un módulo ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// URL de tu endpoint para crear productos
const apiUrl = `${process.env.HOST}:${process.env.PORT}/products`;

// Ruta al archivo JSON
const dataPath = path.join(__dirname, 'products.json');

// Token de acceso para la API
const apiToken = process.env.API_TOKEN;

// Función para obtener todos los productos de la API que coinciden con un nombre dado
const getProductsByName = async (productName) => {
  try {
    const encodedProductName = encodeURIComponent(productName);
    const response = await axios.get(`${apiUrl}?name=${encodedProductName}`, {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
      },
    });

    // Verificar si la lista de productos está vacía o si la respuesta es falsa
    if (!response.data || response.data.products.length === 0) {
      return []; // No se encontraron productos con el nombre proporcionado
    } else {
      return response.data.products; // Se encontraron productos con el nombre proporcionado
    }
  } catch (error) {
    console.error('Error al obtener los productos por nombre:', error.message);
    return []; // Error al realizar la solicitud
  }
};

// Función para cargar un producto en la API
const loadProduct = async (product) => {
  try {
    const response = await axios.post(apiUrl, product, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`, // Agregar el token al encabezado de autorización
      },
    });
    console.log(`Producto cargado: ${response.data.name}`);
  } catch (error) {
    console.error('Error al cargar el producto:', product.name, error.response?.data || error.message);
  }
};

// Leer el archivo JSON y cargar los datos
const loadData = async () => {
  try {
    const data = fs.readFileSync(dataPath, 'utf8');
    const products = JSON.parse(data);

    for (const product of products) {
      // Verificar si el producto ya existe en la API
      const existingProducts = await getProductsByName(product.name);
      if (existingProducts.length === 0) {
        await loadProduct(product);
      } else {
        console.log(`El producto ${product.name} ya existe en la API, se omitirá.`);
      }
    }

    console.log('Datos cargados exitosamente!');
  } catch (error) {
    console.error('Error al leer o cargar los datos:', error.message);
  }
};

loadData();
