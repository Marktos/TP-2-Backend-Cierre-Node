import { Router } from "express";
import { createPayment, deletePayment, getPayment, getUserPayments, getPaymentById} from "../controller/pagosController.js";
import { handleErrors } from "../middlewares/handleErrors.js";
import { isAdmin, isUser } from "../middlewares/authorization.js";
import { verifyToken } from "../middlewares/tokenVerification.js";
import { body, param } from "express-validator";

const router = Router();

//Middleware para verificar el token
router.use(verifyToken);

//Ruta para crear un nuevo recibo
router.post('/:userId', 
    param('userId')
        .isInt({ gt: 0 }).withMessage('El ID del Usuario debe ser un número entero positivo'),
    body('description')
        .isString().withMessage('La descripción debe ser un string')
        .trim().isLength({ min: 5 }).withMessage('Mínimo 5 caracteres'),
    body('amount')
        .isInt({ gt: 0 }).withMessage('El monto debe ser un número'),
    isAdmin, // Solo administradores pueden crear recibos
    handleErrors, // Manejo de errores de validación
    createPayment // Controlador para crear el recibo
);

//Ruta para obtener todos los recibos
router.get('/', isAdmin, getPayment);

//Ruta para obtener un recibo por ID
router.get('/:receiptId', 
    param('receiptId')
        .isInt({ gt: 0 }).withMessage('El ID del Recibo debe ser un número entero positivo'),
    isUser, // Solo usuarios pueden ver recibos
    handleErrors,
    getPaymentById
);

//Ruta para obtener recibos por ID de usuario
router.get('/user/:userId', 
    param('userId')
        .isInt({ gt: 0 }).withMessage('El ID del Usuario debe ser un número entero positivo'),
    isUser, // Solo usuarios pueden ver sus propios recibos
    handleErrors,
    getUserPayments
);

//Ruta para eliminar un recibo
router.delete('/:receiptId', 
    param('receiptId')
        .isInt({ gt: 0 }).withMessage('El ID del Recibo debe ser un número entero positivo'),
    isAdmin, // Solo administradores pueden eliminar recibos
    handleErrors,
    deletePayment // Controlador para eliminar el recibo
);

export default router;
