const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { hashPassword } = require('../hashPassword'); // Asegura que la ruta es correcta

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, 'is invalid']
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'client'],
    default: 'client'
  },
  accountNumber: {
    type: String,
    unique: true
  },
  balance: {
    type: Number,
    default: 0
  },
  transactions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction'
    }
  ]
});

// Hashear la contraseña si ha sido modificada
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    try {
      this.password = await hashPassword(this.password);
      next();
    } catch (error) {
      next(error); // Manejo adecuado de errores en el proceso de hashing
    }
  } else {
    next(); // Continuar si la contraseña no ha sido modificada
  }
});

//Método para comparar contraseñas
userSchema.methods.comparePassword = async function(candidatePassword){
  try{
    return await bcrypt.compare(candidatePassword, this.password);
  }catch (error){
    console.error('Error comparing password:', error);
    throw error;
  }
};
// Generar un número de cuenta único si es nuevo y no tiene uno
userSchema.pre('save', function(next) {
  if (this.isNew && !this.accountNumber) {
    this.accountNumber = Math.random().toString(36).substring(2, 11); // Crea un número de cuenta
    next();
  } else {
    next();
  }
});

// Método para ajustar el balance
userSchema.methods.adjustBalance = function(amount) {
  if (this.balance + amount < 0 && !this.authorizedOverdraft) {
    throw new Error('Insufficient funds');
  }
  this.balance += amount;
  return this.save();
};

// Índices para mejorar la eficiencia de las consultas
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ accountNumber: 1 }, { unique: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
