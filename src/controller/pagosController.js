import Payment from '../models/pagos.modelo.js';
import path from 'path';
import Usuario from '../models/usuario.modelo.js';
import fs from 'fs';

// Aclaramos que la extensión de los archivos permitida sea PDF
const allowedExtensions = ['pdf'];

// Registrar un pago
const createPayment = async (req, res) => {
  const { amount, userId } = req.body;

  try {
    // Verifico si el usuario existe
    const userExist = await Usuario.findByPk(userId);
    if (!userExist) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Verifico si se ha subido un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('Archivo obligatorio.');
    }

    const receipt = req.files.receipt; // Accedo al archivo subido

    // Verifico que el archivo sea un PDF
    const fileExtension = receipt.name.split('.').pop();
    if (!allowedExtensions.includes(fileExtension)) {
      return res.status(400).json({ message: `Solo se permiten archivos ${allowedExtensions.join(', ')}` });
    }

    // Guarda el archivo en la carpeta `uploads/`
    const uploadPath = path.join(__dirname, '../uploads/', receipt.name);
    await receipt.mv(uploadPath);

    // Creo el pago en la base de datos con la URL del recibo
    const payment = await Payment.create({ amount, userId, receiptUrl: uploadPath, fechaCompra: new Date() });
    res.status(201).json({ message: 'Pago registrado con éxito', payment });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar el pago', error: error.message });
  }
};

// Subir un recibo de pago
const uploadPaymentReceipt = async (req, res) => {
  try {
    // Verifico si se ha subido algún archivo
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: 'No se ha subido ningún archivo.' });
    }

    const receipt = req.files.receipt; // Accedemos al archivo subido

    // Verifico que sea un archivo PDF
    if (receipt.mimetype !== 'application/pdf') {
      return res.status(400).json({ message: 'Solo se permiten archivos PDF.' });
    }

    // Guarda el archivo en la carpeta `uploads/`
    const uploadPath = path.join(__dirname, '../uploads/', receipt.name);
    await receipt.mv(uploadPath);

    res.status(200).json({ message: 'Archivo subido correctamente.', filePath: uploadPath });
  } catch (error) {
    res.status(500).json({ message: 'Error al subir el archivo.', error: error.message });
  }
};

// Eliminar un pago y su archivo asociado
const deletePayment = async (req, res) => {
  const { paymentId } = req.params;

  try {
    const payment = await Payment.findByPk(paymentId);
    if (!payment) return res.status(404).send('El pago no existe');

    const filePath = path.join(__dirname, '../uploads/', payment.receiptUrl);
    await payment.destroy();

    // Elimino el archivo físico
    fs.unlink(filePath, (error) => {
      if (error) {
        console.error('Error al eliminar el archivo:', error);
      }
    });

    res.status(200).send('El pago fue eliminado exitosamente');
  } catch (error) {
    res.status(500).send('Error al eliminar el pago');
  }
};

// Obtener un pago por su ID
const getPaymentById = async (req, res) => {
  const { paymentId } = req.params;

  try {
    // Verifico si el recibo existe
    const payment = await Payment.findByPk(paymentId);
    if (!payment) return res.status(404).send('El pago no existe');

    // Verifico si el recibo pertenece al usuario autenticado
    if (req.user.role === 'user' && req.user.id !== payment.userId) {
      return res.status(403).send('No tienes acceso a este pago.');
    }

    // Armo la ruta de búsqueda del archivo
    const filePath = path.join(__dirname, '../uploads/', payment.receiptUrl);

    // Lo descargo
    return res.download(filePath, (err) => {
      if (err) {
        console.error('Error al descargar el archivo:', err);
        return res.status(500).send('Error al descargar el archivo');
      }
    });
  } catch (error) {
    res.status(500).send('Ha ocurrido un error');
  }
};

// Obtener los pagos de un usuario
const getUserPayments = async (req, res) => {
  const userId = req.user.id; // ID del usuario autenticado

  try {
    const payments = await Payment.findAll({ where: { userId } });
    res.status(200).json({ payments });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los pagos', error: error.message });
  }
};

// Obtener todos los pagos
const getPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll();
    res.status(200).json({ payments });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los pagos', error: error.message });
  }
};

export {
  createPayment,
  uploadPaymentReceipt,
  deletePayment,
  getPaymentById,
  getUserPayments,
  getPayments
};
