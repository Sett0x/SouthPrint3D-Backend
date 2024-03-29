import jwt from 'jsonwebtoken';
import config from '../config.js';
import { HttpStatusError } from 'common-errors';

export async function logout(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return next(new HttpStatusError(401, 'No se proporcionó un token de autorización'));
  }

  try {
    // Verificar si el token proporcionado es válido
    jwt.verify(token, config.app.secretKey);

    // Si el token es válido, establecer el token de autorización como vacío para invalidar el token anterior y "cerrar sesión"
    res.setHeader('Authorization', '');
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    next(new HttpStatusError(401, 'Token inválido'));
  }
}
