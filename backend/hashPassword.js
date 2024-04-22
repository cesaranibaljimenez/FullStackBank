const bcrypt = require('bcrypt');

async function hashPassword(password) {
  const saltRounds = 10;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('Hashed Password:', hashedPassword);
    return hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error);
    return null;  // Es importante manejar el caso de error también
  }
}

async function checkPassword(inputPassword, storedHash) {
  try {
    return await bcrypt.compare(inputPassword, storedHash);
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
}

// Uso del función para hashar una contraseña de ejemplo
//hashPassword();

module.exports = {hashPassword, checkPassword};
