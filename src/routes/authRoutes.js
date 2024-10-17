import express from "express";
import { register, login } from "../controller/authenticationController.js";
import { createPayment, getPayments } from "../controller/pagosController.js";
import { createUser, getAllUsers, getUserById, updateUser, getUserPayments, deleteUser, uploadReceiptFromUrl, isSuperAdmin } from '../controller/usuarioController.js';
import verifyToken from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/payments', verifyToken, createPayment);
router.get('/payments', verifyToken, getPayments);

// Endpoint protegido
router.get('/protected-endpoint', verifyToken, (req, res) => {
res.status(200).json({ message: 'Acceso permitido' });
});

// Crear un usuario (Superadmin puede crear administradores, administradores pueden crear usuarios comunes)
router.post('/users', verifyToken, createUser);

// Obtener todos los usuarios (solo para superadministradores)
router.get('/users', verifyToken, isSuperAdmin, getAllUsers);

// Obtener usuario por ID
router.get('/users/:userId', verifyToken, getUserById);

// Actualizar usuario
router.put('/users/:userId', verifyToken, updateUser);

// Eliminar usuario
router.delete('/users/:userId', verifyToken, deleteUser);

// Ver pagos de usuario (Solo usuario común)
router.get('/users/payments', verifyToken, getUserPayments);

// Subir un recibo en PDF (Solo administradores)
router.post('/users/receipt', verifyToken, uploadReceiptFromUrl);

// Ruta protegida para superusuario
router.get('/superadmin/only', verifyToken, isSuperAdmin, (req, res) => {
res.status(200).json({ message: 'Acceso garantizado para el superadministrador' });
});

export default router;
