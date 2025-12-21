const mongoose = require('mongoose');
const User = require('./models/User');

const MONGO_URI = 'mongodb://localhost:27017/eventhub';

const seedData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing users only (optional - remove if you want to keep existing users)
        await User.deleteMany();
        console.log('Existing users cleared.');

        // Create Admin User
        await User.create({
            name: 'Admin User',
            email: 'admin@eventhub.com',
            password: 'admin123', // Will be hashed by User model pre-save hook
            isAdmin: true
        });
        console.log('Admin user created successfully.');

        console.log('Data Seeding Complete!');
        process.exit();
    } catch (error) {
        console.error('Error during seeding:', error);
        process.exit(1);
    }
};

seedData();
