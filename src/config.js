import 'dotenv/config';

const config = {
    port: process.env.PORT || 8080,
    icon: {
        url: process.env.ICON_URL,
        apiKey: process.env.ICON_API_KEY,
    },
    app: {
      secretKey: process.env.APP_SECRET_KEY // Clave secreta para JWT
  },
    // Configuración de la base de datos MongoDB
    mongodb: {
        url: process.env.MONGODB_URL, // URL de conexión a MongoDB
    },
};

export default config;

/*
import 'dotenv/config';

const config = {
  port: process.env.PORT || 8080,
  app: {
    secretKey: process.env.APP_SECRET_KEY,
  },
  database: {
    host: process.env.MONGODB_HOST,
    port: process.env.MONGODB_PORT,
    dbName: process.env.MONGODB_DBNAME,
    user: process.env.MONGODB_USER,
    password: process.env.MONGODB_PASSWORD,
  },
};

export default config;

*/
