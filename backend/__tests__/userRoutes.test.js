const express = require('express');
const router = express.Router();
const User = require('./User'); // Asegúrate de que la ruta al modelo es correcta

router.post('/create-account', async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('Email already in use');
        }
        const newUser = new User({ name, email, password, role });
        await newUser.save();
        res.status(201).send('User created successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
