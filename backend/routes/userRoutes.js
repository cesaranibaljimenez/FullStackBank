const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Asegúrate de que la ruta al modelo es correcta
const bcrypt = require('bcrypt');

 //Aquí puedes definir controladores para manejar la lógica de negocio
//  rutas para una API de usuario
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// Create Account
router.post('/create-account', async(req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('Email already in use');
        }
        const hashedPassword = await bcrypt.hash(password, 8);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role
        });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully'});

    } catch (error) {
        res.status(500).json({message: 'Error creating the user', error: error.message});
    }
});


// Login
router.post('/login', async (req, res) =>{
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if(!user){
           return res.status(404).json('User not found');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({message:'Invalid credentials'});
        }
        res.json('User logged in succesfully');
    } catch (error) {
        res.status(500).json({message: 'Error loggin in', error: error.message});
    }
});



module.exports = router;
