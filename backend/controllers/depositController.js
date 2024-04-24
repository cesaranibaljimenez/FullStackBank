const User = require('../models/User');
const Transaction = require('../models/Transactions');

const deposit = async function(req, res) {
    const { userId, amount } = req.body;

    

    try {

        // Validate that the amount is a number
        if (isNaN(amount) || amount < 0) {
            return res.status(400).json({ message: 'The amount must be a positive numeric value.' });
        }

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
        //Envía la respuesta exitosa

        res.json({ message: 'Deposit successful', balance: user.balance });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = { deposit };




