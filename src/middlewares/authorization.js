const isSuperAdmin = (req, res, next) => {
    if (req.user.role !== 'superadmin') return res.status(403).json({ message: 'Solo el superusuario está autorizado.' });
    next();
};

const isAdmin = (req, res, next) => {
    if (!['admin', 'superadmin'].includes(req.user.role)) return res.status(403).json({ message: 'Solo administradores están autorizados.' });
    next();
};

const isUser = (req, res, next) => {
    if (!['superadmin', 'admin', 'user'].includes(req.user.role)) return res.status(403).json({ message: 'No autorizado.' });
    next();
};

export { isSuperAdmin, isAdmin, isUser };