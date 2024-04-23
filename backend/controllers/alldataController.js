const User = require('../models/User');
const Transaction = require('../models/Transactions'); 

getAllData = async function(req, res) {
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


module.exports = { getAllData };