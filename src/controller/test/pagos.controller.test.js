// Importamos las dependencias necesarias para los tests
import request from 'supertest'; // Simula peticiones HTTP
import app from '../app';         // Importamos la app de Express
import Payment from '../models/pagos.modelo.js'; // Importamos el modelo Payment

// Mockeamos el modelo Payment para evitar interacciones reales con la base de datos
jest.mock('../models/pagos.modelo.js');

describe('Payments Controller', () => {
  
  // Test para la función de crear un nuevo pago
  describe('POST /payments', () => {
    it('debería crear un nuevo pago y devolver la información del pago', async () => {
      // Simulamos que la creación del pago en la base de datos es exitosa
      const mockPayment = {
        id: 1,
        reciboId: 123,
        amount: 500,
        receipt: null,
        fechaCompra: new Date(),
        userId: 1
      };
      Payment.create.mockResolvedValue(mockPayment);

      // Hacemos una petición POST simulada a la ruta /payments con un usuario autenticado
      const res = await request(app)
        .post('/payments')
        .set('Authorization', 'Bearer fake-jwt-token') // Simulamos la autorización JWT
        .send({
          reciboId: 123,
          amount: 500
        });

      // Verificamos que el estado de la respuesta sea 201 (creado)
      expect(res.status).toBe(201);
      // Verificamos que en el cuerpo de la respuesta esté la información del pago
      expect(res.body.payment).toEqual(mockPayment);
    });

    it('debería devolver un error si la creación del pago falla', async () => {
      // Simulamos que ocurre un error durante la creación del pago
      Payment.create.mockRejectedValue(new Error('Error en la creación del pago'));

      // Hacemos una petición POST simulada a la ruta /payments con un usuario autenticado
      const res = await request(app)
        .post('/payments')
        .set('Authorization', 'Bearer fake-jwt-token')
        .send({
          reciboId: 123,
          amount: 500
        });

      // Verificamos que el estado de la respuesta sea 400 (error del cliente)
      expect(res.status).toBe(400);
      // Verificamos que en el cuerpo de la respuesta esté el mensaje de error
      expect(res.body.error).toBe('Error en la creación del pago');
    });
  });

  // Test para la función de obtener los pagos de un usuario
  describe('GET /payments', () => {
    it('debería devolver todos los pagos del usuario autenticado', async () => {
      // Simulamos que se encuentran pagos asociados al usuario
      const mockPayments = [
        { id: 1, reciboId: 123, amount: 500, receipt: null, fechaCompra: new Date(), userId: 1 },
        { id: 2, reciboId: 456, amount: 300, receipt: null, fechaCompra: new Date(), userId: 1 }
      ];
      Payment.findAll.mockResolvedValue(mockPayments);

      // Hacemos una petición GET simulada a la ruta /payments con un usuario autenticado
      const res = await request(app)
        .get('/payments')
        .set('Authorization', 'Bearer fake-jwt-token'); // Simulamos la autorización JWT

      // Verificamos que el estado de la respuesta sea 200 (OK)
      expect(res.status).toBe(200);
      // Verificamos que en el cuerpo de la respuesta estén los pagos del usuario
      expect(res.body.payments).toEqual(mockPayments);
    });

    it('debería devolver un error si ocurre un problema al obtener los pagos', async () => {
      // Simulamos un error durante la búsqueda de pagos
      Payment.findAll.mockRejectedValue(new Error('Error al obtener pagos'));

      // Hacemos una petición GET simulada a la ruta /payments con un usuario autenticado
      const res = await request(app)
        .get('/payments')
        .set('Authorization', 'Bearer fake-jwt-token');

      // Verificamos que el estado de la respuesta sea 400 (error del cliente)
      expect(res.status).toBe(400);
      // Verificamos que en el cuerpo de la respuesta esté el mensaje de error
      expect(res.body.error).toBe('Error al obtener pagos');
    });
  });
});
