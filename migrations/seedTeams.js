// seeders/seedTeams.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('mysql://root:password@localhost:3306/dincosarl'); // Remplacez avec votre chaîne de connexion

const Team = sequelize.define('Team', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    facebook: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    instagram: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    twitter: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    github: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    timestamps: true,
});

const seedTeams = async () => {
    await sequelize.sync({ force: true }); // Cette commande va supprimer et recréer toutes les tables
    await Team.bulkCreate([
        {
            name: 'Latasha Hicks',
            role: 'UI/UX Designer',
            image: '/images/team1.png',
            facebook: 'https://facebook.com/latasha.hicks',
            instagram: 'https://instagram.com/latasha.hicks',
            twitter: 'https://twitter.com/latasha.hicks',
            github: 'https://github.com/latasha.hicks'
        },
        {
            name: 'John Doe',
            role: 'Développeur Backend',
            image: '/images/team2.png',
            facebook: 'https://facebook.com/john.doe',
            instagram: 'https://instagram.com/john.doe',
            twitter: 'https://twitter.com/john.doe',
            github: 'https://github.com/john.doe'
        },
        // Ajoutez d'autres membres de l'équipe ici
    ]);
    console.log('Les équipes ont été insérées');
};

seedTeams().catch(err => console.error(err));
