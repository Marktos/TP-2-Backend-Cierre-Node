import request from 'supertest';
import app from '../../../app.js'
import User from '../../usuario.modelo.jsmodels/User';
import Payment from '../../pagos.modelo.jsmodels/';
import db from '../../config/db.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import axios from 'axios';
import { isSuperAdmin } from '../usuarioController.js';

dotenv.config();

beforeAll(async () => {
  await db.sync(); //sincroniza las tablas antes de ejecutar los tests
});

// Poblar datos antes de cada prueba
beforeEach(async () => {
  const hashedPassword = await bcrypt.hash('123456', 10);
  await User.create({
    name: 'Admin',
    email: 'admin@example.com',
    password: hashedPassword,
    role: 'superadmin'
  });
});

describe('User Controller', () => {
  describe('createUser', () => {
    it('should create a new user with hashed password', async () => {
      const userPayload = { name: 'John', email: 'john@example.com', password: '123456', role: 'user' };

      // Hacer la petición para crear un usuario
      const res = await request(app)
        .post('/api/users')
        .send(userPayload)
        .set('Authorization', 'Bearer fakeTokenWithSuperAdminRole');

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe('Usuario creado correctamente');
    });

    it('should prevent creation of admin by non-superadmin', async () => {
      const userPayload = { name: 'John', email: 'john@example.com', password: '123456', role: 'admin' };

      const res = await request(app)
        .post('/api/users')
        .send(userPayload)
        .set('Authorization', 'Bearer fakeTokenWithAdminRole');

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toBe('No tienes permisos para crear administradores.');
    });
  });
});

describe('getUserPayments', () => {
  it('should return user payments', async () => {
    // Crear un usuario y pagos para la prueba
    const user = await User.create({
      name: 'User',
      email: 'user@example.com',
      password: 'password123',
      role: 'user'
    });

    await Payment.create({ amount: 100, userId: user.id });
    await Payment.create({ amount: 200, userId: user.id });

    // Realizar la petición para obtener pagos
    const res = await request(app)
      .get('/api/payments')
      .set('Authorization', 'Bearer fakeTokenWithUserRole');

    expect(res.statusCode).toBe(200);
    expect(res.body.payments.length).toBe(2); // Debe haber dos pagos
  });
});

describe('uploadReceiptFromUrl', () => {
  it('should upload a receipt from URL if the file is a PDF', async () => {
    const pdfUrl = 'http://example.com/file.pdf';
    const response = await axios.get(pdfUrl, { responseType: 'stream' });

    // Simular subir el archivo desde la URL
    const res = await request(app)
      .post('/api/upload-receipt')
      .send({ pdfUrl })
      .set('Authorization', 'Bearer fakeTokenWithAdminRole');

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Recibo subido correctamente');
  });
});

describe('isSuperAdmin middleware', () => {
  it('should allow access for superadmin', async () => {
    const req = { user: { role: 'superadmin' } };
    const res = {};
    let nextCalled = false;
    
    const next = () => {
      nextCalled = true;
    };

    isSuperAdmin(req, res, next);

    expect(nextCalled).toBe(true);
  });

  it('should deny access for non-superadmin', () => {
    const req = { user: { role: 'admin' } };
    
    const res = {
      status: function(statusCode) {
        this.statusCode = statusCode;
        return this;
      },
      json: function(response) {
        this.response = response;
      }
    };

    const next = () => {};

    isSuperAdmin(req, res, next);

    expect(res.statusCode).toBe(403);
    expect(res.response).toEqual({ message: 'Acceso denegado. Solo el superadministrador tiene acceso.' });
  });
});
afterAll(async () => {
  await sequelize.close(); //cierra la conexión después de los tests
});