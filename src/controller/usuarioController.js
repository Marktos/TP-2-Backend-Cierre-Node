import User from "../models/usuario.modelo.js"; 
import { passwordHashed } from "../helpers/passwordHashed.js";

// Crear un nuevo usuario
const createUser = async (req, res) => {
const { email, password, role } = req.body;

try {
// Verifica si el usuario ya existe
const exist = await User.findOne({ where: { email } });
if (exist) return res.status(403).json({ message: 'El usuario ya existe' });

// Verifica permisos para crear un usuario con rol 'admin'
const currentUserRole = req.user?.role || 'user'; // Asignamos un rol por defecto
    if (role === 'admin' && currentUserRole !== 'superusuario') {
        return res.status(403).json({ message: 'No tienes permisos para crear administradores.' });
    }   

// Crea el nuevo usuario
const newUser = await User.create({
    email,
    password: await passwordHashed(password), // Hasheamos la contraseña
    role
});

    return res.status(201).json({ message: 'Usuario creado con éxito', newUser });
        } catch (error) {
    return res.status(500).json({ message: 'Error al crear el usuario', error: error.message });
    }
};

// Obtener todos los usuarios
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({ data: users });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los usuarios', error: error.message });
  }
};

// Obtener usuario por ID
const getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'El usuario no existe' });

    res.status(200).json({ data: user });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el usuario', error: error.message });
  }
};

// Actualizar usuario
const updateUser = async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body; // Si estás actualizando el rol
  const currentUserRole = req.user?.role || 'user'; // Rol del usuario que está haciendo la solicitud

  try {
      const user = await User.findByPk(userId);
      if (!user) return res.status(404).json({ message: 'El usuario no existe' });

      // Verifica permisos para actualizar a un admin o superusuario
      if ((role === 'admin' || role === 'superusuario') && currentUserRole !== 'superusuario') {
          return res.status(403).json({ message: 'No tienes permisos para actualizar este tipo de usuario.' });
      }

      // Si se actualiza la contraseña, hay que hashearla de nuevo
      if (req.body.password) {
          req.body.password = await passwordHashed(req.body.password);
      }

      await user.update(req.body);
      res.status(200).json({ message: 'Usuario actualizado', data: user });
  } catch (error) {
      res.status(500).json({ message: 'Error al actualizar el usuario', error: error.message });
  }
};

// Eliminar usuario
const deleteUser = async (req, res) => {
  const { userId } = req.params;
  const currentUserRole = req.user?.role || 'user'; // Rol del usuario que está haciendo la solicitud

  try {
      const user = await User.findByPk(userId);
      if (!user) return res.status(404).json({ message: 'El usuario no existe' });

      // Verifica permisos para eliminar administradores o superusuarios
      if (user.role === 'admin' || user.role === 'superusuario') {
          if (currentUserRole !== 'superusuario') {
              return res.status(403).json({ message: 'No tienes permisos para eliminar este tipo de usuario.' });
          }
      }

      await user.destroy();
      res.status(200).json({ message: 'Usuario eliminado' });
  } catch (error) {
      res.status(500).json({ message: 'Error al eliminar el usuario', error: error.message });
  }
};

//obtengo el registro de pagos de un usuario
const getUserPayments = async (req, res) => {
  const userId = req.user.id; 
  try {
    const payments = await Payment.findAll({ where: { userId } });
    res.status(200).json({ payments });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los pagos', error: error.message });
  }
};

//verifico si el usuario autenticado es superusuario
const isSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'superadmin') {
    return res.status(403).json({ message: 'Acceso denegado. Solo el superadministrador tiene acceso.' });
  }
  next();
};

export { createUser, getAllUsers, getUserById, updateUser, deleteUser, isSuperAdmin,  };
