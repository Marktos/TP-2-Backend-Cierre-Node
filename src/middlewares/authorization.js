//Verifica si el usuario es superAdmin.
const isSuperAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'superadmin') {
        return res.status(403).send("Solo el superusuario está autorizado");
    }
    next();
};

//Verifica si el usuario es admin.
    const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
        return res.status(403).send("Solo administradores están autorizados");
    }
    next();
};

// Verifica si el usuario es user.
    const isUser = (req, res, next) => {
    if (req.user.role !== 'superadmin' && req.user.role !== 'admin' && req.user.role !== 'user') {
        return res.status(403).send("No autorizado");
    }
    next();
    };

    export { isSuperAdmin, isUser, isAdmin}
