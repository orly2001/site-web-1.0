const { Sequelize } = require('sequelize');

// Create a connection to the database
const sequelize = new Sequelize('dincosarl', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;
