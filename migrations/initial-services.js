// migrations/initial-data.js
const sequelize = require('../backend/config/database'); // Chemin mis à jour
const Team = require('../backend/models/Team');
const Service = require('../backend/models/Service');

const teamsData = [
    {
        name: 'Latasha Hicks',
        role: 'UI/UX Designer',
        image: '/images/team1.png',
        facebook: '#',
        instagram: '#',
        twitter: '#',
        github: '#'
    },
    {
        name: 'John Doe',
        role: 'Développeur Backend',
        image: '/images/team2.png',
        facebook: '#',
        instagram: '#',
        twitter: '#',
        github: '#'
    },
    {
        name: 'Jane Smith',
        role: 'Développeuse Frontend',
        image: '/images/team3.png',
        facebook: '#',
        instagram: '#',
        twitter: '#',
        github: '#'
    },
    {
        name: 'Emily Johnson',
        role: 'Chef de Projet',
        image: '/images/team4.png',
        facebook: '#',
        instagram: '#',
        twitter: '#',
        github: '#'
    }
];

const servicesData = [
    {
        title: 'Maintenance industrielle',
        description: 'Chez DINCO SARL, nous offrons des services complets de maintenance industrielle pour assurer le bon fonctionnement et la longévité de vos équipements.',
        image: '/images/Group%201675.png'
    },
    {
        title: 'Import-Export',
        description: "Nous facilitons les opérations d'import-export, vous permettant d'accéder à des marchés internationaux et de recevoir vos produits rapidement et efficacement.",
        image: '/images/Group%201752.png'
    },
    {
        title: 'Vente de pièces de rechange',
        description: 'Nous fournissons une large gamme de pièces de rechange pour divers équipements industriels, garantissant des solutions fiables et rapides.',
        image: '/images/Group%201387.png'
    }
];

const insertInitialData = async () => {
    try {
        await sequelize.sync({ force: true }); // Crée et réinitialise toutes les tables
        await Team.bulkCreate(teamsData);
        await Service.bulkCreate(servicesData);
        console.log('Données initiales insérées avec succès.');
    } catch (error) {
        console.error('Erreur lors de l\'insertion des données initiales:', error);
    } finally {
        sequelize.close();
    }
};

insertInitialData();
