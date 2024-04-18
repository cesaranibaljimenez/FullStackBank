const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

// Crear una instancia de la aplicación express
const app = express();

// Middleware para analizar las solicitudes con cuerpo JSON
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error)=> {
    console.log('Error connecting to MongoDB:' , error);
  });

// Configuración para servir archivos estáticos
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));
console.log("Serving static files from:", path.join(__dirname, '..', 'frontend', 'build'));


// Rutas definidas en userRoutes.js
app.use('/api', userRoutes);

// Servir index.html para cualquier otra ruta no manejada directamente por las rutas de API
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
  });

// Manejador de errores para rutas no encontradas
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

//Manejador de errores global
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error'
    });
});

// Inicia el servidor en un puerto específico
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
  }

  module.exports = app;
