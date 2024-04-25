const mongoose = require('mongoose');

async function connectToDatabase() {
    const uri = process.env.MONGODB_URI;

    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB Atlas');
    } catch (error) {
        console.error('Error connecting to MongoDB Atlas:', error);
    }
}

module.exports = { connectToDatabase };

