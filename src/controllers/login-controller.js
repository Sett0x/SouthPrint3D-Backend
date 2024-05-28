import bcrypt from 'bcrypt';
import { HttpStatusError } from 'common-errors';
import jwt from 'jsonwebtoken';

import config from '../config.js';
import User from '../models/User.js'

export async function login(req, res, next) {
  const { usernameOrEmail, password } = req.body;

  try {
      // Verificar si ya hay un token de usuario en la solicitud
      const authorizationHeader = req.headers.authorization;
      if (authorizationHeader) {
          const token = authorizationHeader.split(' ')[1];
          jwt.verify(token, config.app.secretKey, (err, decoded) => {
              if (err) {
                  // Si el token no es válido, continuamos con el inicio de sesión normalmente
              } else {
                  // Si el token es válido, significa que el usuario ya está autenticado
                  throw new HttpStatusError(400, 'Ya has iniciado sesión');
              }
          });
      }

      // Validar la entrada
      if (!usernameOrEmail || !password) {
          throw new HttpStatusError(400, 'El nombre de usuario/correo electrónico y la contraseña son obligatorios');
      }

      // Buscar al usuario por su nombre de usuario o correo electrónico en la base de datos
      const user = await User.findOne({
          $or: [
              { username: usernameOrEmail },
              { email: usernameOrEmail }
          ]
      });

      // Si no se encuentra el usuario, devuelve un error de credenciales inválidas
      if (!user) {
          throw new HttpStatusError(401, 'Credenciales inválidas');
      }

      // Compara la contraseña proporcionada con la contraseña almacenada
      const isPasswordValid = await bcrypt.compare(password, user.password);

      // Si las contraseñas no coinciden, devuelve un error de credenciales inválidas
      if (!isPasswordValid) {
          throw new HttpStatusError(401, 'Credenciales inválidas');
      }

      // Si las credenciales son válidas, genera un token JWT
      const userInfo = { id: user._id, username: user.username }; // Ajusta la información del usuario según tus necesidades
      const token = jwt.sign(userInfo, config.app.secretKey, { expiresIn: '24h' }); // Ajusta el tiempo de expiración según tus necesidades

      // Envía el token JWT en la respuesta al cliente
      res.json({ token });
  } catch (error) {
      next(error); // Pasa el error al siguiente middleware para su manejo
  }
}
