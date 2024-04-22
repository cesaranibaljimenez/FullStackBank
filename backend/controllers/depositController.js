async function deposit(req, res) {
    const { userId, amount } = req.body;
  
    try {
      const user = await User.findById(userId);
      user.balance += amount;
      await user.save();
  
      // Opcional: Registrar la transacción
      await new Transaction({ user: userId, type: 'deposit', amount }).save();
  
      res.json({ message: 'Deposit successful', balance: user.balance });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  