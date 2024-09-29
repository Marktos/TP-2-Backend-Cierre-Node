import Payment from '../models/pagos.modelo.js';
import path from 'path';
import Usuario from '../models/usuario.modelo.js'

//Aclaramos que la extencion de los archivos sea PDF
const extension = ['pdf'];


// Registrar un pago
const createPayment = async (req, res) => {
  const { amount, userId } = req.body;

  try {
    // Primero verifica que el usuario existe
    const userExist = await Usuario.findByPk(userId);
    if (!userExist) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Revisamos si el usuario carga un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(403).send('Sin archivos, campo obligatorio');
    }

    const receipt = req.files.receipt; // Accede al archivo subido

    // Verifica que el archivo sea un PDF
    const fileExtension = receipt.name.split('.').pop();
    if (!extensions.includes(fileExtension)) {
      return res.status(400).json({ message: `Solo se permiten archivos ${extension}` });
    }

    // Guarda el archivo en la carpeta `uploads/`
    const uploadPath = path.join(__dirname, '../uploads/', receipt.name);
    await receipt.mv(uploadPath);

    // Creo el pago en la base de datos con la URL del recibo
    const payment = await Payment.create({ amount, userId, receiptUrl: uploadPath });
    res.status(201).json({ message: 'Pago registrado con éxito', payment });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar el pago', error: error.message });
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
  } catch (error) {
    res.status(500).json({ message: 'Error al subir el archivo.', error: error.message });
  }
};
// Eliminar un recibo y su archivo asociado
const deletePayment = async (req, res) => {
  const { paymentId } = req.params;

  try {
    const payment = await payment.findByPk(paymentId);
    if (!receipt) return res.status(404).send('El recibo no existe');

    const pathFile = path.join('../uploads/', payment.location);
    await payment.destroy();
    fs.unlink(pathFile, (err) => {
      if (error) {
        console.error('Error al eliminar el archivo:', error);
      }
    });

    res.status(200).send('El pago fue eliminado exitosamente');
  } catch (error) {
    res.status(500).send('Error al eliminar el pago');
  }
};


//Obtenemos el pago mediante su id
const getPaymentById = async (req, res) => {
  const { receiptId } = req.params;
  try {
    //Vemos si el recibo existe
    const receipt = await Receipt.findByPk(receiptId);
    if (!receipt) return res.status(404).send("El Recibo no Existe");

    //Vemos si el recibo pertenece a el usuario
    if (req.user.rol === "user" && req.user.id !== receipt.userId) {
      return res.status(409).send("El Recibo no es tuyo");
    }

    //Armo la ruta de busqueda del archivo
    const pathFile = path.join(__dirname, "../uploads/", receipt.location);

    //Lo descargo
    return res.download(pathFile, (err) => {
      if (err) {
        console.error("Error al descargar el archivo:", err);
        return res.status(500).send("Error al descargar el archivo");
      }
    });
  } catch (error) {
    res.status(500).send("Ha ocurrido un error");
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


//Obtenemos todos loss pagos 
const getPayment = async (req, res) => {
  const receipts = await Receipt.findAll();
  res.status(200).json({ data: receipts });
};

export {createPayment, getUserPayments, uploadPaymentReceipt, deletePayment, getPaymentById, getPayment}