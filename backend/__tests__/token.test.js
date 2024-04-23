const jwt = require('jsonwebtoken');
const { generateToken } = require('../middleware/tokenServices');

// Mock para process.env.JWT_SECRET
process.env.JWT_SECRET = 'jwt_secret';

// Mock para jwt.sign
jwt.sign = jest.fn((payload, secret, options) => 'mocked_token');

describe('generateToken', () => {
  it('genera un token JWT válido', () => {
    const user = { _id: 'user_id', email: 'test@example.com' };
    const token = generateToken(user);

    // Verifica que jwt.sign sea llamado con los argumentos correctos
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: 'user_id' },
      'jwt_secret',
      { expiresIn: '1h' }
    );

    // Verifica que la función retorne el token generado
    expect(token).toBe('mocked_token');
  });
});
