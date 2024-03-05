import mongoose from 'mongoose';
import logger from '../utils/logger.js';

export default async function(config) {
  const url = config.mongodb.url;

  try {
    await mongoose.connect(url);
    logger.info(`Conexión exitosa a MongoDB`);
  } catch(err) {
    logger.error(`Error conectando a MongoDB en .\n ${err}`);
  }
}
