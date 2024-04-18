const request = require('supertest');
const app = require('../index'); // Importa la aplicación Express desde tu archivo principal (index.js)


  it('GET / should return status code 200', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });

  it('GET /navbar should return status code 200', async () => {
    const response = await request(app).get('/navbar');
    expect(response.statusCode).toBe(200);
  });

  it('GET /create-account should return status code 200', async () => {
    const response = await request(app).get('/create-account');
    expect(response.statusCode).toBe(200);
  });

  it('GET /login should return status code 200', async () => {
    const response = await request(app).get('/login');
    expect(response.statusCode).toBe(200);
  });

  const jwt = require('jsonwebtoken');

  // Simular una función para generar un token JWT válido
  const generateJWT = (user) => {
    return jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '1h' });
  };
  
  // Obtener un token JWT válido para simular la autenticación
  const token = generateJWT('id_del_usuario');
  
  // Usar el token JWT en tus solicitudes de prueba
  it('GET /deposit should return status code 200', async () => {
    const response = await request(app)
      .get('/deposit')
      .set('Authorization', `Bearer ${token}`);
  
    expect(response.statusCode).toBe(200);
  });


  it('GET /withdraw should return status code 200', async () => {
    const response = await request(app)
      .get('/withdraw')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
  });

  it('GET /alldata should return status code 200', async () => {
    const response = await request(app)
      .get('/alldata')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
  });

