import User from '../models/user.js';

export async function getUsers(req, res) {
  const users = await User.find();
  res.json(users);
}

export async function getUserById(req, res) {
  const { id } = req.params;
  // Solo permitir que un usuario acceda a su propio perfil
  if (req.user.id !== id) {
    return res.status(403).json({ message: 'Acceso no autorizado' });
  }
  const user = await User.findById(id);
  res.json(user);
}

export async function updateUser(req, res) {
  const { id } = req.params;
  const userData = req.body;
  // Permitir que un usuario actualice su propio perfil
  if (req.user.id !== id) {
    return res.status(403).json({ message: 'Acceso no autorizado' });
  }
  const user = await User.findByIdAndUpdate(id, userData, { new: true });
  res.json(user);
}

export async function deleteUser(req, res) {
  const { id } = req.params;
  // Permitir que un usuario elimine su propio perfil
  if (req.user.id !== id) {
    return res.status(403).json({ message: 'Acceso no autorizado' });
  }
  await User.findByIdAndDelete(id);
  res.status(204).end();
}
