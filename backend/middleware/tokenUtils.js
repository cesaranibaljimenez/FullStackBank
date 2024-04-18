const jwt = require('jsonwebtoken');
require('dotenv').config(); // Importar la configuración de variables de entorno desde .env

const verifyToken = (token) => {
    // Verificar la firma del token y devolver los datos del usuario si el token es válido
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
};

module.exports = verifyToken;
