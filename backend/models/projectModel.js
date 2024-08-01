const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Project = sequelize.define('Project', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    mainImage: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    timestamps: true
});

const ProjectImage = require('./projectImageModel'); // Assurez-vous que le modèle ProjectImage est importé

// Définir l'association entre Project et ProjectImage
Project.hasMany(ProjectImage, { as: 'images', foreignKey: 'projectId' });
ProjectImage.belongsTo(Project, { foreignKey: 'projectId' });

module.exports = Project;
