import { Router } from 'express';
import { createAdmin, getAdmin, updateAdmin, deleteAdmin, getAdminId } from '../controller/adminController.js';
import { isAdmin, isSuperAdmin } from '../middlewares/authorization.js';
import { handleErrors } from '../middlewares/handleErrors.js'
import { body, param } from 'express-validator';

const router = Router();

router.use( isSuperAdmin, isAdmin);

//Obtene todos los administradores
router.get('/', getAdmin);

//Obtene un administrador por ID
router.get('/:adminId', 
    param('adminId')
        .isInt({ gt: 0 }).withMessage('El ID del Admin debe ser un número entero positivo'),
    handleErrors,
    getAdminId
);

// Registra un nuevo administrador
router.post('/register', 
    body('name')
        .isString().withMessage('El nombre debe ser un string')
        .trim().isLength({ min: 5, max: 15 }).withMessage('Minimo 5 caracteres, maximo 15'),
    body('email')
        .trim()
        .isEmail().withMessage('Ingrese un email válido'),
    body('password')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
        .matches(/\d/).withMessage('La contraseña debe contener al menos un número')
        .matches(/[A-Za-z]/).withMessage('La contraseña debe contener al menos una letra'),
    handleErrors,
    createAdmin
);

//Actualiza al Admin
router.put('/:adminId',
    param('adminId')
        .isInt({ gt: 0 }).withMessage('El ID del Admin debe ser un número entero positivo'), 
    body('name')
        .isString().withMessage('El nombre debe ser un string')
        .trim().isLength({ min: 5, max: 15 }).withMessage('Minimo 5 caracteres, maximo 15'),
    body('email')
        .trim()
        .isEmail().withMessage('Ingrese un email válido'),
    body('password')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
        .matches(/\d/).withMessage('La contraseña debe contener al menos un número')
        .matches(/[A-Za-z]/).withMessage('La contraseña debe contener al menos una letra'),
    handleErrors,
    updateAdmin
);

//Eliminan a un Admin
router.delete('/:adminId', 
    param('adminId')
        .isInt({ gt: 0 }).withMessage('El ID del Admin debe ser un número entero positivo'),
    handleErrors,
    deleteAdmin
);

export default router;
