const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AllSection = sequelize.define('AllSection', {
    page: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sectionName: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});

module.exports = AllSection;
