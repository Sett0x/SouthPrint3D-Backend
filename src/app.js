import express from 'express';
import { init } from './loaders/index.js';
import config from './config.js';
import mongoose from 'mongoose';

const app = express();

// Configurar la conexión a MongoDB

mongoose.connect(config.mongodb.url)
  .then(() => {
    console.log('Conexión exitosa a MongoDB');
    // Inicializar la aplicación una vez que se establezca la conexión a la base de datos
    init(app, config);
  })
  .catch(err => {
    console.error('Error al conectar con MongoDB:', err);
  });

export default app;


