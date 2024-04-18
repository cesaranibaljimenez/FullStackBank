const express = require('express');
const router = express.Router();

// Aquí puedes definir controladores para manejar la lógica de negocio
// Ejemplo de rutas para una API de usuario
router.get('/users', (req, res) => {
    // Obtener usuarios
    res.json([{ name: "John Doe" }]);
});

router.post('/users', (req, res) => {
    // Crear un nuevo usuario
    res.status(201).json({ message: "Usuario creado" });
});

// Aquí puedes añadir más rutas para otras operaciones de la API
router.post('/login', (req, res) => {
    // Simular un inicio de sesión
    res.json({ message: "Inicio de sesión exitoso" });
});

module.exports = router;
