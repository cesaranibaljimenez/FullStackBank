const mongoose = require('mongoose');

// Definir el esquema del usuario
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
    enum: ['admin', 'client'], // Roles permitidos
    default: 'client' // Rol por defecto
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

// Middleware para hashear la contraseña antes de guardar el usuario
userSchema.pre('save', function(next) {
  if (!this.isModified('password')) return next();

  bcrypt.hash(this.password, saltRounds, (err, hash) => {
    if (err) return next(err);
    this.password = hash;
    next();
  });
});

userSchema.pre('save', function(next) {
    if (this.isNew && !this.accountNumber) {
        this.accountNumber = Math.random().toString(36).slice(2, 11); // Utiliza slice en lugar de substr
    }
    next();
});

userSchema.methods.adjustBalance = function(amount) {
    if (this.balance + amount < 0 && !this.authorizedOverdraft) {
        throw new Error('Insufficient funds');
    }
    this.balance += amount;
    return this.save();
};



// Crear el modelo User a partir del esquema definido
const User = mongoose.model('User', userSchema);

// Exportar el modelo User
module.exports = User;
