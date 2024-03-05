import express from 'express';
import { init } from './loaders/index.js';
import config from './config.js';

const app = express();

// Inicializar la aplicación una vez que se establezca la conexión a la base de datos
init(app, config);

export default app;
