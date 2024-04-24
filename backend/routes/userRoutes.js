console.log('Cargando userRoutes.js');


const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { authMiddleware } = require('../middleware/auth');
const { generateToken } = require('../middleware/tokenServices');
const User = require('../models/User'); // Asegúrate de que la ruta al modelo es correcta
const { checkPassword } = require('../hashPassword'); // Importa la función de comparación de contraseñas
const { deposit } = require('../controllers/depositController');
const { withdraw } = require('../controllers/withdrawController');
const { AllData, AllTransactions } = require('../controllers/alldataController');



console.log('Dependencias importadas en userRoutes.js');

// Rutas para una API de usuario
router.get('/users', async (req, res) => {
    console.log('Accediendo a la ruta GET /users');
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Crear cuenta
router.post('/create-account', async (req, res) => {
    console.log('Accediendo a la ruta POST /create-account');
    const { name, email, password, role } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('Email ya en uso');
            return res.status(400).json({message: 'Email already in use'});
        }
        const newUser = new User({ name, email, password, role }); // password ya viene hasheado del modelo
        await newUser.save();
        console.log('Usuario creado exitosamente');
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error creating the user', error: error.message });
    }
});



router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({message:'User not found'});
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'User logged in successfully', token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

// Ruta para depositar fondos
router.post('/deposit', authMiddleware, deposit);
  
  // Ruta para retirar fondos
  router.post('/withdraw', authMiddleware, withdraw);
  
  // Ruta para obtener toda la información de la cuenta del usuario
  router.get('/alldata', authMiddleware, AllData);

  // Ruta para obtener toda la información de la cuenta del usuario
  router.get('/alltransactions', authMiddleware, AllTransactions);

  console.log('Rutas registradas en userRoutes.js');

module.exports = router;
