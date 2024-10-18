import request from 'supertest'; // Simula peticiones HTTP
import app from '../app';         // Importamos la app de Express
import User from '../models/usuario.modelo.js'; // Mockeamos el modelo User
import Payment from '../models/pagos.modelo.js'; // Mockeamos el modelo Payment
import fs from 'fs';
import axios from 'axios';
import path from 'path';

// Mockeamos los modelos y librerías para evitar interacciones reales con la base de datos y sistema de archivos
jest.mock('../models/usuario.modelo.js');
jest.mock('../models/pagos.modelo.js');
jest.mock('axios');
jest.mock('fs');
jest.mock('path');

describe('User and Payments Controllers', () => {

  // Test para la creación de usuarios
  describe('POST /users', () => {
    it('debería permitir a un superadmin crear un nuevo admin', async () => {
      const mockUser = { id: 1, name: 'Admin', email: 'admin@example.com', role: 'admin' };
      User.create.mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/users')
        .set('Authorization', 'Bearer superadmin-jwt-token') // Simulamos la autorización del superadmin
        .send({
          name: 'Admin',
          email: 'admin@example.com',
          password: 'password123',
          role: 'admin'
        });

      expect(res.status).toBe(201);
      expect(res.body.newUser).toEqual(mockUser);
    });

    it('debería denegar la creación de un admin a un usuario no superadmin', async () => {
      const res = await request(app)
        .post('/users')
        .set('Authorization', 'Bearer admin-jwt-token') // Simulamos un token de admin que no tiene permisos
        .send({
          name: 'Admin',
          email: 'admin@example.com',
          password: 'password123',
          role: 'admin'
        });

      expect(res.status).toBe(403);
      expect(res.body.message).toBe('No tienes permisos para crear administradores.');
    });
  });

  // Test para la obtención de pagos de un usuario
  describe('GET /payments', () => {
    it('debería devolver los pagos del usuario autenticado', async () => {
      const mockPayments = [{ id: 1, amount: 100, reciboId: 123, userId: 1 }];
      Payment.findAll.mockResolvedValue(mockPayments);

      const res = await request(app)
        .get('/payments')
        .set('Authorization', 'Bearer user-jwt-token'); // Simulamos un usuario autenticado

      expect(res.status).toBe(200);
      expect(res.body.payments).toEqual(mockPayments);
    });

    it('debería devolver un error si ocurre un problema al obtener los pagos', async () => {
      Payment.findAll.mockRejectedValue(new Error('Error al obtener pagos'));

      const res = await request(app)
        .get('/payments')
        .set('Authorization', 'Bearer user-jwt-token');

      expect(res.status).toBe(500);
      expect(res.body.message).toBe('Error al obtener los pagos');
    });
  });

  // Test para la subida de recibos PDF desde una URL
  describe('POST /receipts/upload', () => {
    it('debería subir un archivo PDF desde una URL si el usuario es admin', async () => {
      const mockResponse = { headers: { 'content-type': 'application/pdf' }, data: { pipe: jest.fn() } };
      axios.get.mockResolvedValue(mockResponse);
      const writeStream = { on: jest.fn((event, cb) => { if (event === 'finish') cb(); }) };
      fs.createWriteStream.mockReturnValue(writeStream);
      path.basename.mockReturnValue('recibo.pdf');

      const res = await request(app)
        .post('/receipts/upload')
        .set('Authorization', 'Bearer admin-jwt-token') // Simulamos un token de admin
        .send({ pdfUrl: 'http://example.com/recibo.pdf' });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Recibo subido correctamente');
    });

    it('debería denegar el acceso si el usuario no es admin', async () => {
      const res = await request(app)
        .post('/receipts/upload')
        .set('Authorization', 'Bearer user-jwt-token') // Simulamos un token de usuario común
        .send({ pdfUrl: 'http://example.com/recibo.pdf' });

      expect(res.status).toBe(403);
      expect(res.body.message).toBe('Acceso denegado. Solo los administradores pueden subir recibos.');
    });

    it('debería devolver un error si la URL no es un archivo PDF', async () => {
      const mockResponse = { headers: { 'content-type': 'text/html' }, data: { pipe: jest.fn() } };
      axios.get.mockResolvedValue(mockResponse);

      const res = await request(app)
        .post('/receipts/upload')
        .set('Authorization', 'Bearer admin-jwt-token')
        .send({ pdfUrl: 'http://example.com/not-pdf' });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('La URL proporcionada no es un archivo PDF.');
    });
  });

  // Test para verificar si el usuario es superadmin
  describe('GET /superadmin', () => {
    it('debería permitir el acceso si el usuario es superadmin', async () => {
      const res = await request(app)
        .get('/superadmin')
        .set('Authorization', 'Bearer superadmin-jwt-token'); // Simulamos un token de superadmin

      expect(res.status).toBe(200);
    });

    it('debería denegar el acceso si el usuario no es superadmin', async () => {
      const res = await request(app)
        .get('/superadmin')
        .set('Authorization', 'Bearer admin-jwt-token'); // Simulamos un token de admin

      expect(res.status).toBe(403);
      expect(res.body.message).toBe('Acceso denegado. Solo el superadministrador tiene acceso.');
    });
  });
});
