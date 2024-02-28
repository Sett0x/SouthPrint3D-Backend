import bcrypt from 'bcrypt';
import { HttpStatusError } from 'common-errors';
import jwt from 'jsonwebtoken';

import config from '../config.js';
import User from '../models/user.js'; // Importa el modelo de usuario

/*
export function login(req, res, next){
       const { username, password } = req.body;

    const user = findUser(username);

    if(user){
        console.log(password, user.password);
        if(bcrypt.compareSync(password, user.password)){
            const userInfo = { id: user.id, name: user.name };
            const jwtConfig = { expiresIn: 10 };
            const token = jwt.sign(userInfo, config.app.secretKey, jwtConfig);
            return res.send({token});
        }
    }

    throw new HttpStatusError(401, 'Invalid credentials');
}

*/

export async function login(req, res, next) {
  const { username, password } = req.body;

  try {
      // Busca al usuario por su nombre de usuario en la base de datos
      const user = await User.findOne({ username });

      // Si no se encuentra el usuario, devuelve un error de credenciales inválidas
      if (!user) {
          throw new HttpStatusError(401, 'Invalid credentials');
      }

      // Compara la contraseña proporcionada con la contraseña almacenada
      const isPasswordValid = await bcrypt.compare(password, user.password);

      // Si las contraseñas no coinciden, devuelve un error de credenciales inválidas
      if (!isPasswordValid) {
          throw new HttpStatusError(401, 'Invalid credentials');
      }

      // Si las credenciales son válidas, genera un token JWT
      const userInfo = { id: user._id, username: user.username }; // Ajusta la información del usuario según tus necesidades
      const token = jwt.sign(userInfo, config.app.secretKey, { expiresIn: '1h' }); // Ajusta el tiempo de expiración según tus necesidades

      // Envía el token JWT en la respuesta al cliente
      res.json({ token });
  } catch (error) {
      next(error); // Pasa el error al siguiente middleware para su manejo
  }
}
