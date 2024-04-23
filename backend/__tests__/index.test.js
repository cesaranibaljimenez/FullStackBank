require('dotenv').config();

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
let authToken;

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
    let authToken;
    let createdUserId;

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
        createdUserId = savedUser._id;  // Save user ID for later tests
    }, 30000);

    test('POST /api/login should authenticate a user and return a token', async () => {
        const userData = {
            name: 'Jane Doe',
            email: 'jane@example.com',
            password: 'password321',
            role: 'client'
        };
    
        // Asegúrate de que el usuario es creado
        await request(app).post('/api/create-account').send(userData);
    
        // Intenta iniciar sesión
        const loginResponse = await request(app)
            .post('/api/login')
            .send({ email: 'jane@example.com', password: 'password321' });
    
        expect(loginResponse.statusCode).toBe(200);
        expect(loginResponse.body.message).toBe('User logged in successfully');
        expect(loginResponse.body.token).toBeDefined();
        authToken = loginResponse.body.token; // Almacena el token para usarlo después
    }, 30000);

    test('POST /api/deposit should allow a logged-in user to deposit funds', async () => {
        const depositResponse = await request(app)
            .post('/api/deposit')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ userId: createdUserId, amount: 100 });

        expect(depositResponse.statusCode).toBe(200);
        expect(depositResponse.body.message).toBe('Deposit successful');
        expect(depositResponse.body.balance).toBeDefined();
    }, 30000);

    test('POST /api/withdraw should allow a logged-in user to withdraw funds', async () => {
        const withdrawResponse = await request(app)
            .post('/api/withdraw')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ userId: createdUserId, amount: 50 });

        expect(withdrawResponse.statusCode).toBe(200);
        expect(withdrawResponse.body.message).toBe('Withdrawal successful');
        expect(withdrawResponse.body.balance).toBeDefined();
    }, 30000);

    test('GET /api/allData should provide all account data for a logged-in user', async () => {
        const allDataResponse = await request(app)
            .get('/api/allData')
            .set('Authorization', `Bearer ${authToken}`)
            .query({ userId: createdUserId });

        expect(allDataResponse.statusCode).toBe(200);
        expect(allDataResponse.body).toBeDefined();
        expect(allDataResponse.body.transactions).toBeDefined(); // Assuming transactions are being returned
    }, 30000);
});