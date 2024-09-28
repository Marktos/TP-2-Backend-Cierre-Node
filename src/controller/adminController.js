import Admin from "../models/admin.modelo.js";
import { passwordHashed } from "../helpers/passwordHashed"; 
import User from "../models/usuario.modelo.js"

/** Creo a mi superusuario */
const createSuper = async () => {
    const superUser = await Admin.findOne({where: {rol: 'superadmin'}})
    const password = await hashPassword('superadmin')
    if(!superUser) {
        Admin.create({
            name: 'root',
            email: 'root@admin.com',
            password,
            rol: 'superadmin'
        })
    }
};

const createAdmin = async (req, res) =>{
    //Vamos a verificar si el usuario ya fue creado primero
    let existe = await User.findOne ({ where: ( email )});
    if (!existe) existe = await Admin.findOne({ where: ( email ) });
    //Si existe retorno un 409 y devulvo que ya existe
    if (existe) return res.status(409).send('El usuario ya existe');

    const usuario = await Admin.create(req.body)

    //Vamos a hashear la contrasenia con mi funcion passwordHashed
    usuario.password = await passwordHashed(password)

    //Guardamos nuestro usuario
    await usuario.save()

    //Retornamos un 201 por usuario creado exitosamente
    return res.status(201).json({ data: {usuario: usuario.name, email}})

}

const getAdmin = async (req, res) => {
    const usuarios = await Admin.findAll()
    res.json({ data: usuarios })
};

const getAdminId = async (req, res) => {
    const {IdAdmin} = req.params
    try {
        //Hacemos una funcion para ver si existe ese usuario
        const admin = await Admin.findByPk(IdAdmin)
        //Si ve que no existe envia un 404 y retorna que el usuario no existe
        if (!admin) return res.status(404).send('El administrador no existe')
    } catch (error) {
        //hago un catch en el caso de que algo falle y que devuelva un 500 errors
        res.status(500).send('Ocurrio un error')
    }
}



/** Creo un superusuario por defecto */