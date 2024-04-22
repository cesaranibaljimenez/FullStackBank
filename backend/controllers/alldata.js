async function getAllData(req, res) {
    const { userId } = req.query; // O podrías usar params o body según tu diseño de API
  
    try {
      const user = await User.findById(userId).populate('transactions');
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  