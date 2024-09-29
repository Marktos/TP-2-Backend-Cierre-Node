//Verifica si el usuario es superAdmin.
const isSuperAdmin = (req, res, next) => {
    if (req.user.rol !== 'superadmin') {
        return res.status(403).send("Solo el superusuario está autorizado");
    }
    next();
};

//Verifica si el usuario es admin.

    const isAdmin = (req, res, next) => {
    if (req.user.rol !== 'admin' && req.user.rol !== 'superadmin') {
        return res.status(403).send("Solo administradores están autorizados");
    }
    next();
};

// Verifica si el usuario es user.

    const isUser = (req, res, next) => {
    if (req.user.rol !== 'superadmin' && req.user.rol !== 'admin' && req.user.rol !== 'user') {
        return res.status(403).send("No autorizado");
    }
    next();
    };

    export { isSuperAdmin, isUser, isAdmin}
