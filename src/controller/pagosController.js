// Importamos los modelos User y Payment para interactuar con las tablas de usuarios y pagos
import User from '../models/usuario.modelo.js';
import Payment from '../models/pagos.modelo.js';

// Controlador para crear un nuevo pago
const createPayment = async (req, res) => {
  // Extraemos los campos necesarios del cuerpo de la solicitud
  const { amount, reciboId } = req.body;

  // Si se ha subido un archivo, guardamos su ruta, si no, asignamos null
  const receipt = req.file ? req.file.path : null;

  // Obtenemos el ID del usuario autenticado desde el token JWT (almacenado en req.user)
  const userId = req.user.id;

  try {
    // Creamos un nuevo pago en la base de datos con la información proporcionada
    const payment = await Payment.create({
      reciboId,              // ID del recibo asociado al pago
      amount,                // Monto del pago
      receipt,               // Ruta del archivo del recibo si existe
      fechaCompra: new Date(), // Asignamos la fecha actual como la fecha de compra
      userId                 // ID del usuario que realiza el pago
    });

    // Respondemos con el pago creado y un código de éxito 201
    res.status(201).json({ payment });
  } catch (error) {
    // Si ocurre un error, respondemos con un código 400 y el mensaje de error
    res.status(400).json({ error: error.message });
  }
};

// Controlador para obtener todos los pagos de un usuario autenticado
const getPayments = async (req, res) => {
  // Obtenemos el ID del usuario autenticado desde el token JWT (almacenado en req.user)
  const userId = req.user.id;

  try {
    // Buscamos todos los pagos asociados al usuario en la base de datos
    const payments = await Payment.findAll({ where: { userId } });

    // Respondemos con los pagos encontrados y un código de éxito 200
    res.status(200).json({ payments });
  } catch (error) {
    // Si ocurre un error, respondemos con un código 400 y el mensaje de error
    res.status(400).json({ error: error.message });
  }
};

// Exportamos las funciones createPayment y getPayments para que puedan ser utilizadas en otras partes de la aplicación
export{
    getPayments,
    createPayment
}
