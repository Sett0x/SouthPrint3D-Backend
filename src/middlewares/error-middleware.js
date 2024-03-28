import logger from '../utils/logger.js';

export function errorMiddleware(err, req, res, next) {
    logger.error(`${err.message} ${err.stack}`);

    // Verificar si el error es un error de autenticación o autorización
    if (err.status === 401 || err.status === 403) {
        return res.status(err.status).json({ error: err.message });
    }

    // Manejar otros errores aquí
    const status = err.status || 500;
    const message = status === 500 ? 'Server Error' : err.message;
    const errorResponse = {
        status,
        message
    };
    res.status(status).json(errorResponse);
}
