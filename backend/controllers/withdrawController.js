const User = require('../models/User');
const Transaction = require('../models/Transactions');  // Asegúrate de que la ruta sea correcta

withdraw = async function(req, res) {
    const { userId, amount } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.balance < amount) {
            return res.status(400).json({ message: 'Insufficient funds' });
        }

        user.balance -= amount;
        await user.save();

        const transaction = new Transaction({
            user: userId,
            type: 'withdrawal',
            amount: amount
        });
        await transaction.save();

        res.json({ message: 'Withdrawal successful', balance: user.balance });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { withdraw };