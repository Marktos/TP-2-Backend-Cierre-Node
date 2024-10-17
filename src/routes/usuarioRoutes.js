import { Router } from 'express';
import { body, param } from 'express-validator';
import { handleErrors } from '../middlewares/handleErrors.js';
import { isAdmin } from '../middlewares/authorization.js';
import { verifyToken } from '../middlewares/tokenVerification.js';
import { createUser, deleteUser, getUserById, getAllUsers, updateUser } from '../controller/usuarioController.js';


const router = Router();

//Middleware para verificar si el token y el rol es de administrador
router.use(isAdmin);

//Ruta para registrar a un nuevo usuario
router.post('/register', 
    body('name')
        .isString().withMessage('El nombre debe ser un string')
        .trim().isLength({ min: 5, max: 15 }).withMessage('Mínimo 5 caracteres, máximo 15'),
    
    body('email')
        .trim()
        .isEmail().withMessage('Ingrese un email válido'),
    
    body('password')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
        .matches(/\d/).withMessage('La contraseña debe contener al menos un número')
        .matches(/[A-Za-z]/).withMessage('La contraseña debe contener al menos una letra'),
    
    handleErrors, // Manejo de errores de validación
    createUser // Controlador para crear el usuario
);

//Ruta para obtener a todos los usuarios
router.get('/', getAllUsers);

//Ruta para obtener a un usuario por ID
router.get('/:userId', 
    param('userId')
        .isInt({ gt: 0 }).withMessage('El ID del Usuario debe ser un número entero positivo'),
    
    handleErrors,
    getUserById // Controlador para obtener un usuario por ID
);

//Ruta para poder actualizar un usuario por ID
router.put('/:userId',
    param('userId')
        .isInt({ gt: 0 }).withMessage('El ID del Usuario debe ser un número entero positivo'), 

    body('name')
        .isString().withMessage('El nombre debe ser un string')
        .trim().isLength({ min: 5, max: 15 }).withMessage('Mínimo 5 caracteres, máximo 15'),

    body('email')
        .trim()
        .isEmail().withMessage('Ingrese un email válido'),
    
    body('password')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
        .matches(/\d/).withMessage('La contraseña debe contener al menos un número')
        .matches(/[A-Za-z]/).withMessage('La contraseña debe contener al menos una letra'),
    
    handleErrors,
    updateUser
);

//Ruta para poder eliminar un usuario por ID
router.delete('/:userId', 
    param('userId')
        .isInt({ gt: 0 }).withMessage('El ID del Usuario debe ser un número entero positivo'),
    
    handleErrors,
    deleteUser // Controlador para eliminar el usuario
);

export default router;
