const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');
require('dotenv').config();


const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

const app = express();

//Middleware para manejar solicitudes con cuerpo JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Habilita CORS para todas las solicitudes
app.use(cors());


// Logs de cada petición para diagnóstico
app.use((req, res, next) => {
  console.log(`Request Type: ${req.method} - URL: ${req.url} - Body: ${JSON.stringify(req.body)}`);
  next();
});

//Conexión a MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.log('Error connecting to MongoDB:', error));

// Rutas API
app.use('/api', userRoutes);

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

// Middleware para errores no capturados en rutas API
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

//Ruta que captura todas las rutas no manejadas y sirve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
});



// Manejador de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});




if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
