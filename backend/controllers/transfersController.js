const User = require('../models/User');
const Transaction = require('../models/Transactions');

const transfer = async (req, res) => {
    const { senderAccountNumber, recipientAccountNumber, amount } = req.body;

    try {
        // Verificar si el remitente existe y tiene suficientes fondos
        const sender = await User.findOne({accountNumber: senderAccountNumber});
        if (!sender) {
            return res.status(404).json({ message: 'Sender not found' });
        }
        if (sender.balance < amount) {
            return res.status(400).json({ message: 'Insufficient funds' });
        }

        // Verificar si el destinatario existe
        const recipient = await User.findOne({accountNumber: recipientAccountNumber});
        if (!recipient) {
            return res.status(404).json({ message: 'Recipient not found' });
        }

        // Realizar la transferencia
        sender.balance -= amount;
        recipient.balance += amount;

        // Guardar los cambios en las cuentas
        await sender.save();
        await recipient.save();

        // Registrar la transacción del remitente
        const senderTransaction = new Transaction({
            user: sender._id,
            type: 'transfer',
            amount: -amount,
            description: `Transfer to ${recipient.accountNumber}`
        });
        await senderTransaction.save();

        // Registrar la transacción del destinatario
        const recipientTransaction = new Transaction({
            user: recipient._id,
            type: 'transfer',
            amount: amount,
            description: `Transfer from ${sender.accountNumber}`
        });
        await recipientTransaction.save();

        res.json({ message: 'Transfer successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { transfer };
