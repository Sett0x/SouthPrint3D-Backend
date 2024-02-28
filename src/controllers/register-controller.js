// register-controller.js

import bcrypt from 'bcrypt';
import User from '../models/user.js'; // Importa el modelo de usuario

export async function register(req, res, next) {
    try {
        const { username, password, email } = req.body;

        // Verificar si ya existe un usuario con el mismo nombre de usuario
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
        }

        // Encriptar la contraseña antes de almacenarla en la base de datos
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear un nuevo usuario con los datos proporcionados
        const newUser = await User.create({
            username,
            password: hashedPassword,
            email
            // Otros campos del usuario, según sea necesario
        });

        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
}
