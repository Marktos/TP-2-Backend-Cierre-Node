import { Router } from "express";
import { body } from "express-validator";
import { handleErrors } from "../middlewares/handleErrors.js"; 
import { login } from "../controller/authenticationController.js"; 

const router = Router();

// Ruta para el inicio de sesión
router.post('/login', 
    body('email')
        .isEmail().withMessage('Ingrese un correo válido'),
    body('password')
        .notEmpty().withMessage('Ingrese una contraseña')
        .isString().withMessage('La contraseña debe ser un string'),
    
    handleErrors,
    login 
);

export default router;
