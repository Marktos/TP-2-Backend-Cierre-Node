// Importamos las dependencias necesarias para los tests
import request from 'supertest'; // Simula peticiones HTTP
import jwt from 'jsonwebtoken';  // Para verificar los tokens generados
import bcrypt from 'bcryptjs';    // Para mockear el hashing de contraseñas
import app from '../app';         // Importamos la app de Express
import User from '../../models/usuario.modelo.js'; // Importamos el modelo User

// Mockeamos funciones para evitar interacciones reales con la base de datos y librerías externas
jest.mock('../models/usuario.modelo.js');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
  
  // Test para la función de registro
  describe('POST /register', () => {
    it('debería registrar un nuevo usuario y devolver un token JWT', async () => {
      // Simulamos que la creación del usuario en la base de datos se realiza con éxito
      const mockUser = { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user' };
      User.create.mockResolvedValue(mockUser);

      // Simulamos la generación de un token JWT
      jwt.sign.mockReturnValue('fake-jwt-token');

      // Hacemos una petición POST simulada a la ruta /register
      const res = await request(app)
        .post('/register')
        .send({ name: 'John Doe', email: 'john@example.com', password: '123456', role: 'user' });

      // Verificamos que el estado de la respuesta sea 201
      expect(res.status).toBe(201);
      // Verificamos que en el cuerpo de la respuesta esté el token y el usuario
      expect(res.body).toEqual({ token: 'fake-jwt-token', user: mockUser });
    });

    it('debería devolver un error si la creación del usuario falla', async () => {
      // Simulamos un error durante la creación del usuario
      User.create.mockRejectedValue(new Error('Error de creación'));

      // Hacemos una petición POST simulada a la ruta /register
      const res = await request(app)
        .post('/register')
        .send({ name: 'John Doe', email: 'john@example.com', password: '123456', role: 'user' });

      // Verificamos que el estado de la respuesta sea 400
      expect(res.status).toBe(400);
      // Verificamos que en el cuerpo de la respuesta esté el mensaje de error
      expect(res.body).toEqual({ error: 'Error de creación' });
    });
  });

  // Test para la función de login
  describe('POST /login', () => {
    it('debería autenticar al usuario y devolver un token JWT', async () => {
      // Simulamos que encontramos al usuario en la base de datos
      const mockUser = { id: 1, email: 'john@example.com', password: 'hashedpassword', role: 'user' };
      User.findOne.mockResolvedValue(mockUser);

      // Simulamos que la comparación de contraseñas es exitosa
      bcrypt.compare.mockResolvedValue(true);

      // Simulamos la generación de un token JWT
      jwt.sign.mockReturnValue('fake-jwt-token');

      // Hacemos una petición POST simulada a la ruta /login
      const res = await request(app)
        .post('/login')
        .send({ email: 'john@example.com', password: '123456' });

      // Verificamos que el estado de la respuesta sea 200
      expect(res.status).toBe(200);
      // Verificamos que en el cuerpo de la respuesta esté el token y el usuario
      expect(res.body).toEqual({ token: 'fake-jwt-token', user: mockUser });
    });

    it('debería devolver un error si las credenciales son incorrectas', async () => {
      // Simulamos que no encontramos al usuario en la base de datos
      User.findOne.mockResolvedValue(null);

      // Hacemos una petición POST simulada a la ruta /login
      const res = await request(app)
        .post('/login')
        .send({ email: 'john@example.com', password: '123456' });

      // Verificamos que el estado de la respuesta sea 401
      expect(res.status).toBe(401);
      // Verificamos que en el cuerpo de la respuesta esté el mensaje 'Datos incorrectos'
      expect(res.body).toEqual({ message: 'Datos incorrectos' });
    });

    it('debería devolver un error si ocurre un problema en el servidor', async () => {
      // Simulamos un error durante la búsqueda del usuario
      User.findOne.mockRejectedValue(new Error('Error de servidor'));

      // Hacemos una petición POST simulada a la ruta /login
      const res = await request(app)
        .post('/login')
        .send({ email: 'john@example.com', password: '123456' });

      // Verificamos que el estado de la respuesta sea 400
      expect(res.status).toBe(400);
      // Verificamos que en el cuerpo de la respuesta esté el mensaje de error
      expect(res.body).toEqual({ error: 'Error de servidor' });
    });
  });
});
