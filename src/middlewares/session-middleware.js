import session from 'express-session';
import connectMongo from 'connect-mongo'; // Asegúrate de tener instalado este paquete

// Importa la configuración de la base de datos MongoDB desde tu archivo de configuración
import config from '../config.js';
import logger from '../utils/logger.js';

// Configuración de la sesión
const sessionConfig = {
  secret: config.APP_SECRET_KEY, // Utiliza la clave secreta de tu aplicación
  resave: false, // Evita que la sesión se guarde en la tienda si no hay cambios
  saveUninitialized: false, // Evita guardar sesiones vacías en la tienda
  cookie: {
    maxAge: config.session.maxAge, // Tiempo de vida de la cookie de sesión en milisegundos
    secure: config.session.cookieSecure, // Asegúrate de que la cookie solo se envíe a través de HTTPS
    httpOnly: true, // Hace que la cookie de sesión solo sea accesible desde el servidor
  },
};

// Configura la tienda de sesión para almacenar las sesiones en MongoDB
const MongoStore = connectMongo(session);

// Crea una nueva instancia de la tienda de sesión de MongoDB
const sessionStore = new MongoStore({
  mongoUrl: config.mongodb.url, // URL de conexión a MongoDB
  collectionName: 'sessions', // Nombre de la colección para almacenar las sesiones
});

// Manejador de errores para la tienda de sesión de MongoDB
sessionStore.on('error', (error) => {
  logger.error(`Error en la tienda de sesiones MongoDB: ${error}`);
});

// Middleware de sesión con la configuración personalizada
export const sessionMiddleware = session({
  ...sessionConfig,
  store: sessionStore, // Usa la tienda de sesión de MongoDB
});

// Middleware para comprobar la autenticación del usuario
export function checkAuthentication(req, res, next) {
  if (req.session && req.session.userId) {
    // Usuario autenticado
    next();
  } else {
    // Usuario no autenticado, redirigir a la página de inicio de sesión
    res.redirect('/login');
  }
}

// Middleware para comprobar si el usuario es administrador
export function checkAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) {
    // Usuario es administrador
    next();
  } else {
    // Usuario no es administrador, mostrar error o redirigir a la página de acceso no autorizado
    const error = new Error('Acceso no autorizado');
    error.status = 403;
    next(error);
  }
}
