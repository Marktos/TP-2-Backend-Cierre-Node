import { passwordHashed, checkPassword, generateToken } from "../helpers/passwordHashed.js";
import User from "../models/usuario.modelo.js";

const login = async (req, res) => {
    const { email, password } = req.body;

    // Verifico si el usuario es un usuario común
    let user = await User.findOne({ where: { email } });

    // Si no es un usuario común, verifico si es un administrador
    if (!user) {
        user = await Admin.findOne({ where: { email } });
    }

    // Si no existe ni como usuario común ni como admin, envío error
    if (!user) {
        return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    // Verifico que la contraseña es correcta
    const validPassword = await checkPassword(password, user.password);
    if (!validPassword) {
        return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    // Genero el token JWT incluyendo id, email y rol
    const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role || 'user' // Si no tiene un rol explícito, por defecto es 'user'
    });

    // Respondo con el token generado
    res.status(200).json({ token });
};

// Registro de usuarios y administradores
const register = async (req, res) => {
    const { name, email, password, role } = req.body; // Recibo los datos del cuerpo de la solicitud

    try {
        // Hashear la contraseña antes de guardar
        const hashedPassword = await passwordHashed(password); // Uso la función para hashear la contraseña

        let user;

        // Creo un usuario o un administrador según el rol recibido
        if (role === 'admin') {
            user = await Admin.create({ name, email, password: hashedPassword });
        } else {
            user = await User.create({ name, email, password: hashedPassword });
        }

        // Genero el token JWT para el usuario registrado
        const token = generateToken({
            id: user.id,
            email: user.email,
            role: role || 'user' // Si no se especifica rol, asigno 'user' por defecto
        });

        // Respondo con el token generado y los datos del usuario
        res.status(201).json({ token, user });

    } catch (error) {
        // En caso de error, respondo con el mensaje del error
        res.status(400).json({ error: error.message });
    }
};

export { login, register };
