const jwt = require('jsonwebtoken');
require('dotenv').config(); // Importar la configuración de variables de entorno desde .env

// Función para generar un token JWT válido
const generateJWT = (user) => {
  // Utilizar la clave secreta almacenada en el archivo .env para firmar el token
  const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return token;
};

// Función para manejar la lógica de inicio de sesión del usuario
const loginUser = async (req, res) => {
    try {
      // Aquí puedes realizar la lógica para verificar las credenciales del usuario
      // Por ejemplo, buscar el usuario en la base de datos y comparar la contraseña
  
      // Si las credenciales son válidas, puedes generar un token JWT y enviarlo en la respuesta
      const token = generateJWT(req.body.username); // Esta función debe ser implementada para generar el token JWT
  
      // Devolver el token como respuesta
      res.status(200).json({ token });
    } catch (error) {
      // Manejar cualquier error que pueda ocurrir durante el proceso de inicio de sesión
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { generateJWT };
