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

// Leer el archivo JSON y cargar los datos
const loadData = async () => {
  try {
    const data = fs.readFileSync(dataPath, 'utf8');
    const products = JSON.parse(data);

    for (const product of products) {
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
    }

    console.log('Datos cargados exitosamente!');
  } catch (error) {
    console.error('Error al leer o cargar los datos:', error.message);
  }
};

loadData();
