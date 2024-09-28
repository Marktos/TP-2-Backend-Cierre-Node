import { Payment } from '../models/pagos.modelo.js';


// Registrar un pago
const createPayment = async (req, res) => {
  const { amount, userId, receiptUrl } = req.body;
  
  try {
    const payment = await Payment.create({ amount, userId, receiptUrl });
    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ message: 'Error al registrar el pago', error: error.message });
  }
};

const uploadPaymentReceipt = async (req, res) => {
  try {
    // Verifica si se subió algún archivo
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: 'No se ha subido ningún archivo.' });
    }

    // Accedemos al archivo subido con el nombre 'receipt'
    const receipt = req.files.receipt;

    // Verifica que sea un archivo PDF
    if (receipt.mimetype !== 'application/pdf') {
      return res.status(400).json({ message: 'Solo se permiten archivos PDF.' });
    }

    // Guarda el archivo en la carpeta `uploads/`
    const uploadPath = `./uploads/${receipt.name}`;
    await receipt.mv(uploadPath);

    res.status(200).json({ message: 'Archivo subido correctamente.', filePath: uploadPath });
  } catch (err) {
    res.status(500).json({ message: 'Error al subir el archivo.', error: err.message });
  }
};

// Obtener pagos de un usuario
const getUserPayments = async (req, res) => {
  const userId = req.user.id; // ID del usuario autenticado
  
  try {
    const payments = await Payment.findAll({ where: { userId } });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los pagos', error: error.message });
  }
};

export {createPayment, getUserPayments, uploadPaymentReceipt}
