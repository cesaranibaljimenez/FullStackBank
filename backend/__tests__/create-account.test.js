// Importamos las librerías necesarias
const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../path/to/your/app'); // Asegúrate de exportar la app desde tu archivo principal
const User = require('../models/User'); // Asegúrate de que la ruta al modelo es correcta

// Conexión a una base de datos de prueba
beforeAll(async () => {
  const url = 'mongodb://127.0.0.1/mytestdb'; // Cambia esto por tu cadena de conexión de prueba
  await mongoose.connect(url, { useNewUrlParser: true });
});

// Limpiamos después de cada prueba
afterEach(async () => {
  await User.deleteMany();
});

// Desconexión después de todas las pruebas
afterAll(async () => {
  await mongoose.connection.close();
});

describe('POST /api/create-account', () => {
  test('It should respond with 201 Created for successfully created user', async () => {
    const newUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'client'
    };

    const response = await request(app)
      .post('/api/create-account')
      .send(newUser);

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('User created successfully');
    // Verificar que la contraseña no se devuelve y está hasheada
    expect(response.body.password).not.toBe('password123');
  });

  test('It should respond with 400 Bad Request if email already exists', async () => {
    const newUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'client'
    };

    // Primero creamos un usuario
    await request(app)
      .post('/api/create-account')
      .send(newUser);

    // Intentamos crear el mismo usuario nuevamente
    const response = await request(app)
      .post('/api/create-account')
      .send(newUser);

    expect(response.statusCode).toBe(400);
    expect(response.text).toBe('Email already in use');
  });
});
