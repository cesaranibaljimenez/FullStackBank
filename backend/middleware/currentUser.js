const jwt = require('jsonwebtoken');
require('dotenv').config(); // Importar la configuración de variables de entorno desde .env
const verifyToken = require('./tokenUtils');


const authMiddleware = (req, res, next) => {
    // Verificar la autenticación del usuario, por ejemplo, a través de un token JWT
    const token = req.headers.authorization;

    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ message: 'No token provided' });
    }

    // Verificar y decodificar el token utilizando la clave secreta del archivo .env
    try {
        const decoded = verifyToken(token);
        req.currentUser = decoded.user;
        console.log('User authenticated:', req.currentUser);
        next();
    } catch (error) {
        console.error('Invalid token:', error);
        return res.status(401).json({ message: 'Invalid token' });
    }
};


module.exports = { authMiddleware }
