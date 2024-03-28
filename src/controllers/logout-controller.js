import jwt from 'jsonwebtoken';
import config from '../config.js';
import { HttpStatusError } from 'common-errors';

/**
 * Controlador para manejar el logout de un usuario.
 * Este controlador se encarga de invalidar el token de autenticación del usuario.
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función de siguiente middleware.
 */
export async function logout(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return next(new HttpStatusError(401, 'No se proporcionó un token de autorización'));
  }

  try {
    // Decodificar el token para obtener la información del usuario
    const decodedToken = jwt.verify(token, config.app.secretKey);

    // Aquí podrías realizar cualquier acción adicional necesaria antes de invalidar el token,
    // como registrar el evento de logout en una base de datos de auditoría, por ejemplo.

    // No es necesario invalidar realmente el token en el servidor,
    // ya que la autenticación basada en token es stateless.
    // Simplemente respondemos con un mensaje de éxito y un token vacío.
    res.status(200).json({ message: 'Logout successful', token: null });
  } catch (error) {
    // Si hay un error al verificar el token, pasa al siguiente middleware para su manejo
    next(new HttpStatusError(401, 'Token inválido'));
  }
}
