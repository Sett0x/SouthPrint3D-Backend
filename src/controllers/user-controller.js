// user-controller.js
import * as UserService from '../services/database/user-db-service.js';

export async function getUsers(req, res) {
  try {
    const filters = req.query;
    const users = await UserService.getUsers(filters);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getUserById(req, res) {
  const { id } = req.params;
  try {
    const user = await UserService.getUserById(id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateUser(req, res) {
  const { id } = req.params;
  const userData = req.body;
  try {
    const user = await UserService.updateUser(id, userData);
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function createUser(req, res) {
  try {
    const { username, password, email, address, phone, nombre } = req.body;

    // Llamar al servicio para registrar al usuario
    const newUser = await UserService.createUser({
      username,
      password,
      email,
      address,
      phone,
      nombre
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function deleteUser(req, res) {
  const { id } = req.params;
  try {
    await UserService.deleteUser(id);
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
