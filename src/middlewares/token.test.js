import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import verifyToken from '../middlewares/verifyToken';  // Ajusta el path según tu estructura

// Clave secreta para firmar el token
const SECRET_KEY = "tremendaclave";

// Creamos una app de express para testear el middleware
const app = express();
app.use(express.json());

// Ruta protegida con el middleware verifyToken
app.get('/protected', verifyToken, (req, res) => {
  res.status(200).json({ message: "Acceso autorizado", user: req.user });
});

// Test para la verificación del token
describe('Test del middleware verifyToken', () => {
  it('Debe permitir el acceso si el token es válido', async () => {
    const token = jwt.sign({ id: 1, role: 'user' }, SECRET_KEY);
    const res = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Acceso autorizado');
    expect(res.body.user).toHaveProperty('id', 1);
    expect(res.body.user).toHaveProperty('role', 'user');
  });

  it('Debe devolver un error 401 si el token es inválido', async () => {
    const invalidToken = "token-invalido";
    const res = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${invalidToken}`);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('msg', 'Token no válido');
  });

  it('Debe devolver un error 403 si no se proporciona un token', async () => {
    const res = await request(app).get('/protected');

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('msg', 'No se proporcionó token');
  });
});
