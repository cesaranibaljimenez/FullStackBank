console.log('Cargando tokenServices.js');

const jwt = require('jsonwebtoken');
const User = require ('../models/User');
const { checkPassword } = require('../hashPassword');
require('dotenv').config();


function generateToken(user) {
   console.log('Generando token para el usuario:', user.email);
   return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

async function loginHandler(req, res, User, checkPassword) {
    console.log('Manejador de login iniciado');
  const { email, password } = req.body;
  try {
    console.log('Buscando usuario:', email);
    const user = await User.findOne({ email });
    if (!user) {
        console.log('Usuario no encontrado:', email);
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('Verificando contraseña');
    const isMatch = await checkPassword.call(user, password);
    if (!isMatch) {
        console.log('Credenciales inválidas');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    console.log('Login exitoso, token generado');
    res.json({ message: 'User logged in successfully', token });
  } catch (error) {
    console.error('Error en loginHandler:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
}

module.exports = {
  generateToken,
  //loginHandler
};

/*
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isMatch = await checkPassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'User logged in successfully', token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

module.exports = {
    generateToken
  };
  */
