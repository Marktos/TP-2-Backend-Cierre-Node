const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'No autorizado. No se ha proporcionado un token.' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'No tienes los permisos necesarios.' });
      }
      
      next();
    } catch (error) {
      return res.status(403).json({ message: 'Token inválido o expirado.' });
    }
  };
};

export default authMiddleware;