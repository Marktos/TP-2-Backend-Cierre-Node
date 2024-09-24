import express from 'express';
import { createPayment, getUserPayments, uploadPaymentReceipt } from '../controller/pagosController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

//Con esta ruta, registro un pago como admin
router.post('/register', authMiddleware(['admin', 'superuser']), createPayment);

router.post('/upload-receipt', uploadPaymentReceipt)

//Obtengo los pagos de usuario
router.get('/mi-pagos', authMiddleware(['user']), getUserPayments)

export default router;