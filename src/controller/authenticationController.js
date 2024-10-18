// Importamos el modelo User para interactuar con la base de datos de usuarios
// Importamos la librería jsonwebtoken para la creación de tokens JWT
// Importamos bcryptjs para el hashing y la comparación de contraseñas
import User from '../models/usuario.modelo.js';
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Controlador para registrar nuevos usuarios
const register = async (req, res) => {
  // Extraemos los campos necesarios del cuerpo de la solicitud
  const { name, email, password, role } = req.body;

  try {
    // Creamos un nuevo usuario en la base de datos con los datos proporcionados
    const user = await User.create({ name, email, password, role });

    // Generamos un token JWT para el nuevo usuario, incluyendo su ID y rol
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);

    // Respondemos con el token y los datos del usuario
    res.status(201).json({ token, user });
  } catch (error) {
    // Si ocurre un error, devolvemos una respuesta con código 400 y el mensaje del error
    res.status(400).json({ error: error.message });
  }
};

// Controlador para manejar el inicio de sesión de usuarios
const login = async (req, res) => {
  // Extraemos el correo electrónico y la contraseña del cuerpo de la solicitud
  const { email, password } = req.body;

  try {
    // Buscamos al usuario en la base de datos por su correo electrónico
    const user = await User.findOne({ where: { email } });

    // Verificamos si el usuario existe y si la contraseña proporcionada coincide con la almacenada
    if (!user || !(await bcrypt.compare(password, user.password))) {
      // Si no coincide o el usuario no existe, respondemos con un código 401 (no autorizado)
      return res.status(401).json({ message: 'Datos incorrectos' });
    }

    // Si las credenciales son correctas, generamos un token JWT con el ID y rol del usuario
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);

    // Respondemos con el token y los datos del usuario
    res.status(200).json({ token, user });
  } catch (error) {
    // Si ocurre un error durante el proceso, respondemos con un código 400 y el mensaje del error
    res.status(400).json({ error: error.message });
  }
};

// Exportamos las funciones login y register para que puedan ser utilizadas en otras partes de la aplicación
export {
    login,
    register
}
