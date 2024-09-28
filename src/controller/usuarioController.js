//Importo el metodo para hashear las contraseñas y mis dos modelos de User y Admin
import { passwordHashed } from "../helpers/passwordHashed";
import User from "../models/usuario.modelo";
import Admin from "../models/admin.modelo";

//Creamos un nuevo usuario
const createUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Primero verifico si el usuario existe
        let exist = await User.findOne({ where: { email } });
        if (!exist) exist = await Admin.findOne({ where: { email } });

        if (exist) return res.status(403).send('El Usuario ya existe');

        const newUser = await User.create(req.body);

        // Hasheo contraseña
        newUser.password = await passwordHashed(password);

        // Guardo el usuario y devuelvo un 201
        await newUser.save();
        return res.status(201).json({ data: { user: newUser.name, email } });
    } catch (error) {
        res.status(500).send('Error al crear el usuario');
    }
};

// Actualizar un usuario
const updateUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).send('El Usuario no Existe');

        await user.update(req.body);
        await user.save();

        res.status(200).json({ data: user });
    } catch (error) {
        res.status(500).send('Error al actualizar el usuario');
    }
};

//Eliminamos a un usuario mediante su id
const deleteUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).send('El Usuario no Existe');

        await user.destroy();

        res.status(200).send('Usuario eliminado');
    } catch (error) {
        res.status(500).send('Error al eliminar el usuario');
    }
};


//Treamos todos los usuarios
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json({ data: users });
    } catch (error) {
        res.status(500).send('Error al obtener los usuarios');
    }
};

// obtenemos a un usuario por ID
const getUserById = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).send('El Usuario no Existe');

        res.status(200).json({ data: user });
    } catch (error) {
        res.status(500).send('Error al obtener el usuario');
    }
};

export {createUser, getAllUsers, getUserById, }
