const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProjectImage = sequelize.define('ProjectImage', {
    projectId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true
});

module.exports = ProjectImage;
