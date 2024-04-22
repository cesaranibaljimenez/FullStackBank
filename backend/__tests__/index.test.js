const express = require('express');
const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const userRoutes = require('../routes/userRoutes'); // Ajusta la ruta según tu estructura
const User = require('../models/User'); // Asegúrate de que la ruta es correcta

const app = express();
app.use(express.json());
app.use('/api', userRoutes);

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}, 30000); // Tiempo extendido para el setup inicial

afterEach(async () => {
    await User.deleteMany({});
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('API tests for user routes', () => {
    test('POST /api/create-account should create a new user', async () => {
        const newUser = {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
            role: 'client'
        };

        const response = await request(app)
            .post('/api/create-account')
            .send(newUser);

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe('User created successfully');

        const savedUser = await User.findOne({ email: 'john@example.com' });
        expect(savedUser).not.toBeNull();
        expect(savedUser.name).toBe(newUser.name);
    }, 30000);

    test('POST /api/create-account should not allow duplicate emails', async () => {
        const userData = {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
            role: 'client'
        };

        // Primera inserción
        await request(app).post('/api/create-account').send(userData);

        // Segunda inserción, debería fallar
        const response = await request(app)
            .post('/api/create-account')
            .send(userData);

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Email already in use');
    }, 30000);

    test('POST /api/login should authenticate a user', async () => {
        const userData = {
            name: 'Jane Doe',
            email: 'jane@example.com',
            password: 'password321',
            role: 'client'
        };

        // Crear usuario
        await request(app).post('/api/create-account').send(userData);

        // Login
        const loginResponse = await request(app)
            .post('/api/login')
            .send({ email: 'jane@example.com', password: 'password321' });

        expect(loginResponse.statusCode).toBe(200);
        expect(loginResponse.body.message).toBe('User logged in successfully');
    }, 30000);
});