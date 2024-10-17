import jwt from 'jsonwebtoken';
import User from '../models/usuario.modelo.js'; 

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'No se proporcionó un token.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Admin.findByPk(decoded.id) || await User.findByPk(decoded.id);

    if (!user) return res.status(404).json({ message: 'Usuario no válido.' });

    req.user = { id: user.id, email: user.email, role: user.role }; // Guardamos la info del usuario
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token no válido o expirado.' });
  }
};

export default verifyToken;