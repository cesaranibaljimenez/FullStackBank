async function withdraw(req, res) {
    const { userId, amount } = req.body;
  
    try {
      const user = await User.findById(userId);
      if(user.balance < amount) {
        return res.status(400).json({ message: 'Insufficient funds' });
      }
  
      user.balance -= amount;
      await user.save();
  
      // Opcional: Registrar la transacción
      await new Transaction({ user: userId, type: 'withdrawal', amount }).save();
  
      res.json({ message: 'Withdrawal successful', balance: user.balance });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  