import User from '../models/user.js';

export async function getUsers(req, res) {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
}

export async function getUserById(req, res) {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el usuario' });
  }
}

export async function updateUser(req, res) {
  const { id } = req.params;
  const userData = req.body;
  try {
    const user = await User.findByIdAndUpdate(id, userData, { new: true });
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el usuario' });
  }
}

export async function deleteUser(req, res) {
  const { id } = req.params;
  try {
    await User.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ message: 'Error al eliminar el usuario' });
  }
}
