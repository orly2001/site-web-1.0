const Section = require('../models/sectionModel');
const User = require('../models/userModel');
const Order = require('../models/orderModel');
const Contact = require('../models/contactModel');
const sequelize = require('../config/database');

// Récupération des données d'évolution des commandes
const getOrderEvolution = async () => {
    const query = `
        SELECT 
            MONTHNAME(createdAt) AS month, 
            COUNT(*) AS count 
        FROM 
            Orders 
        GROUP BY 
            month 
        ORDER BY 
            MONTH(createdAt)
    `;
    const results = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
    return results;
};


const getVisitData = async (req, res) => {
    try {
        const visitData = await Visit.findAll({
            attributes: [
                [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m-%d'), 'date'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['date'],
            order: [['date', 'ASC']]
        });
        res.json(visitData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getContactData = async (req, res) => {
    try {
        const contactData = await Contact.findAll({
            attributes: [
                [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m-%d'), 'date'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['date'],
            order: [['date', 'ASC']]
        });
        res.json(contactData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Récupération des données d'évolution des contacts
const getContactEvolution = async () => {
    const query = `
        SELECT 
            MONTHNAME(createdAt) AS month, 
            COUNT(*) AS count 
        FROM 
            Contacts 
        GROUP BY 
            month 
        ORDER BY 
            MONTH(createdAt)
    `;
    const results = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
    return results;
};

// Gérer l'affichage du tableau de bord
const getDashboard = async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    if (req.session.userRole !== 'admin') {
        return res.status(403).send('Accès refusé');
    }
    try {
        const sections = await Section.findAll();
        const usersCount = await User.count();
        const ordersCount = await Order.count();
        const contactsCount = await Contact.count();
        const ordersEvolution = await getOrderEvolution();
        const contactsEvolution = await getContactEvolution();

        res.render('admin/dashboard', {
            sections,
            usersCount,
            ordersCount,
            contactsCount,
            ordersEvolution,
            contactsEvolution
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des données du tableau de bord :', error);
        res.status(500).send('Erreur interne du serveur');
    }
};

// Gérer l'ajout d'une section
const addSection = async (req, res) => {
    const { title, content, image, page, sectionName } = req.body;
    try {
        await Section.create({ title, content, image, page, sectionName });
        res.redirect('/admin/dashboard');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Gérer la modification d'une section
const editSection = async (req, res) => {
    const { id, title, content, image, page, sectionName } = req.body;
    try {
        const section = await Section.findByPk(id);
        if (section) {
            section.title = title;
            section.content = content;
            section.image = image;
            section.page = page;
            section.sectionName = sectionName;
            await section.save();
            res.redirect('/admin/dashboard');
        } else {
            res.status(404).send('Section non trouvée');
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Gérer la suppression d'une section
const deleteSection = async (req, res) => {
    const { id } = req.body;
    try {
        const section = await Section.findByPk(id);
        if (section) {
            await section.destroy();
            res.redirect('/admin/dashboard');
        } else {
            res.status(404).send('Section non trouvée');
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getDashboard,
    addSection,
    editSection,
    deleteSection,
    getVisitData
};
