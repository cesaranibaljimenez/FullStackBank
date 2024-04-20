const bcrypt = require('bcrypt');

async function hashPassword(password) {
  try {
    const saltRounds = 10; // Ajusta esto según la seguridad que desees
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('Hashed Password:', hashedPassword);
    return hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error);
  }
}

// Uso del función para hashar una contraseña de ejemplo
hashPassword('secret30');
