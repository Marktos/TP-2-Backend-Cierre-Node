import jwt from "jsonwebtoken";
import User from "../models/usuario.modelo.js"; 
import Admin from "../models/admin.modelo.js"; 

//Verifica el JWT que viene en el header de la solicitud. Si es valido, guarda la info del usuario en el request, sino devuelve un error.
 
const verifyToken = async (req, res, next) => {
  const auth = req.headers["authorization"];
  const token = auth && auth.split(" ")[1];

  if (!token) return res.status(401).send('Sin token en el header');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user = await Admin.findByPk(decoded.id);

    if (!user) {
      user = await User.findByPk(decoded.id);
    }

    if (!user) {
      return res.status(409).send('Usuario no válido');
    }

    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
    next();
  } catch (error) {
    return res.status(403).send("Token no válido");
  }
};

export {verifyToken}