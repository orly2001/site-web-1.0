const sequelize = require('../config/database');
const User = require('../models/userModel');
const Section = require('../models/sectionModel');
const Order = require('../models/orderModel');
const Contact = require('../models/contactModel');

const initializeDatabase = async () => {
    try {
        await sequelize.sync({ force: true });

        // Insert sample users
        await User.bulkCreate([
            { firstName: 'John', lastName: 'Doe', dateOfBirth: '1980-01-01', email: 'john@example.com', password: 'hashedpassword', role: 'admin' },
            { firstName: 'Jane', lastName: 'Doe', dateOfBirth: '1985-01-01', email: 'jane@example.com', password: 'hashedpassword', role: 'user' }
        ]);

        // Insert sample sections
        await Section.bulkCreate([
            { title: 'Sample Section 1', content: 'This is a sample section content.', image: '/images/sample1.jpg', page: 'home', sectionName: 'intro' },
            { title: 'Sample Section 2', content: 'This is another sample section content.', image: '/images/sample2.jpg', page: 'about', sectionName: 'overview' }
        ]);

        console.log('Database initialized!');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
};

initializeDatabase();
