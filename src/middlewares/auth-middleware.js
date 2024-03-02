import { HttpStatusError } from "common-errors";
import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";
import User from '../models/user.js';
import config from "../config.js";

export function checkToken(req, res, next){
    console.log(req.headers.authorization)

    const {authorization} = req.headers;

    if(!authorization) throw HttpStatusError(401, 'No token provided');

    const [_bearer, token] = authorization.split(' ');

    try{
        jwt.verify(token, config.app.secretKey);
    }catch(err){
        logger.error(err.message);
        throw HttpStatusError(401, 'Invalid token');
    }

    next();
}

export async function isAdmin(req, res, next) {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      throw new HttpStatusError(401, 'No se proporcionó un token de autorización');
    }

    const token = authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, config.app.secretKey);

    const userId = decodedToken.id;
    const user = await User.findById(userId);
    if (user.role === 'admin') {
      req.user = user;
      return next();
    }

    throw new HttpStatusError(403, 'Acceso no autorizado');
  } catch (error) {
    logger.error(error.message);
    next(error);
  }
}
