import Admin from "../models/admin.modelo.js";
import { passwordHashed } from "../helpers/passwordHashed.js"; 
import User from "../models/usuario.modelo.js"

const createSuper = async () => {
    try {
        // Busca si ya existe un superadmin
        const superUser = await Admin.findOne({ where: { role: 'superadmin' } });

        // Hashea la contraseña
        const password = await passwordHashed('superadmin');

        // Si no existe, crea el superadmin
        if (!superUser) {
            await Admin.create({
                name: 'root',
                email: 'root@admin.com',
                password,
                role: 'superadmin',
            });
            console.log('Superadmin creado exitosamente.');
        } else {
            console.log('El superadmin ya existe.');
        }
    } catch (error) {
        console.error('Error al crear el superadmin:', error.message);
    }
};
createSuper();


const createAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verifica si el usuario ya fue creado
        let existe = await User.findOne({ where: { email } });
        if (!existe) {
            existe = await Admin.findOne({ where: { email } });
        }

        // Si existe, retorno un 409
        if (existe) {
            return res.status(409).send('El usuario ya existe');
        }

        // Hashear la contraseña
        req.body.password = await passwordHashed(password); 
        
        // Crear el nuevo administrador
        const usuario = await Admin.create(req.body);

        // Retornar un 201 por usuario creado exitosamente
        return res.status(201).json({ data: { usuario: usuario.name, email } });
    } catch (error) {
        console.error('Error al crear el administrador:', error);
        return res.status(500).send('Error interno del servidor');
    }
};

const updateAdmin = async (req, res) => {
    const { adminId } = req.params;
    //Hacemos un try-catch para ver si el usuario existe y actualizarlo 
    try {
        //revisamos si es que existe
        const admin = await Admin.findByPk(adminId);
        if (!admin) return res.status(404).send('No existe ningun admin con ese email')

        //espero a que se actualice el usuario/admin y lo guardo
        await admin.update(req.body);
        await admin.save()

        //devuelvo un 200 y devuelvo que se actualizo con exito
        res.status(200).send('actualizado con exito')
    } catch (error) {
        return res.status(500).send('Error desconocido')
    }
}

const deleteAdmin = async (req, res) => {
    const {adminId} = req.params
    try {
        //Hago una funcion similar a la anterior que verifique si existe el admin
        const admin = await Admin.findByPk(adminId)
        if(!admin) return res.status(404).send('El Admin no Existe') 

        //Hago una funcion que verifique que no voy a borrar al superusuario
        if(admin.rol === 'superuser'){
            return res.status(409).send('No se puede eliminar el superusuario') 
        }

        //Borramos al usuario admin y devuelvo un 200 de borrado con exito
        admin.destroy()
        res.status(200).send('Admin eliminado')
    } catch (error) {
        res.status(500).send('Ha ocurrido un error')
    }
}

const getAdmin = async (req, res) => {
    const usuarios = await Admin.findAll()
    res.json({ data: usuarios })
};

const getAdminId = async (req, res) => {
    const { adminId } = req.params;
    try {
        //Hacemos una funcion para ver si existe ese usuario
        const admin = await Admin.findByPk(adminId)
        //Si ve que no existe envia un 404 y retorna que el usuario no existe
        if (!admin) return res.status(404).send('El administrador no existe')
        return res.json({ data: admin });
    } catch (error) {
        //hago un catch en el caso de que algo falle y que devuelva un 500 errors
        res.status(500).send('Ocurrio un error')
    }
}


export {createSuper, createAdmin, updateAdmin, getAdmin, getAdminId, deleteAdmin}