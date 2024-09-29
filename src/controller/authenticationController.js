import { checkPassword, generateToken } from "../helpers/passwordHashed.js";
import User from "../models/usuario.modelo.js"; 
import Admin from "../models/admin.modelo.js"; 

const login = async (req, res) => {
    const { email, password } = req.body

    //Verifico si el usuario es un usuario comun
    let user = await User.findOne({ where: {email} });

    //Verifico si el usuario es un admin
    if (!user) {
        user = await Admin.findOne({ where: { email }});
    }
    if(!user) {
        res.status(401).send('Correo o contrasenia incorrectos');
    }

    //Verefico que la contrasenia es correcta
    const validPassword = await checkPassword(password, user.password)

    if (!validPassword){
        return res.status(401).send('Correo o contrasenia incorrectos');
    }

    //si es correcto que devuelva un JWT
    const token = generateToken({
        id: user.id,
        email: user.email,
        rol: 'rol' in user ? user.rol :'user'
    })
    res.status(200).json({ token: token})
}

export {login}

