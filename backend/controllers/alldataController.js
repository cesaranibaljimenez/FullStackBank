
const User = require('../models/User');
const Transaction = require('../models/Transactions'); 

const AllData = async function(req, res) {
    const { userId } = req.query;

    try {
        const user = await User.findById(userId).populate('transactions');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const AllTransactions = async function(req, res) {
    const { userId } = req.query;

    try {
        const transactions = await Transaction.find({ user: userId });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = { AllData: AllData, AllTransactions: AllTransactions };


