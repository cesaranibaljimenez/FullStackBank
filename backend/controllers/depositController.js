const User = require('../models/User');
const Transaction = require('../models/Transactions');

deposit = async function(req, res) {
    const { userId, amount } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.balance += amount;
        await user.save();

        const transaction = new Transaction({
            user: userId,
            type: 'deposit',
            amount: amount
        });
        await transaction.save();

        res.json({ message: 'Deposit successful', balance: user.balance });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = { deposit };




