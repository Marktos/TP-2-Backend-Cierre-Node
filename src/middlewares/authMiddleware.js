import jwt from 'jsonwebtoken';

const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    const token = req.headers.authorization;
    
    if (!token) {
      return res.status(401).json({ message: 'No autorizado' });
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'No tienes permiso' });
      }
      
      next();
    } catch (error) {
      return res.status(403).json({ message: 'Token inválido' });
    }
  };
};

export default authMiddleware
