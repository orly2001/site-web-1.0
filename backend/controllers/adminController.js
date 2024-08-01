const Section = require('../models/sectionModel');
const User = require('../models/userModel');
const Order = require('../models/orderModel'); 
const Contact = require('../models/contactModel');
const bcrypt = require('bcrypt');
const sequelize = require('../config/database');
const Visit = require('../models/visitModel'); 
const Service = require('../models/Service'); // Ajoutez cette ligne
const Team = require('../models/Team'); // Ajoutez cette ligne
const Project = require('../models/projectModel');


// Gérer l'affichage du tableau de bord
exports.getDashboard = async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    if (req.session.userRole !== 'admin') {
        return res.status(403).send('Accès refusé');
    }
    try {
        const sections = await Section.findAll();
        const services = await Service.findAll();
        const teams = await Team.findAll();
        const projects = await Project.findAll();
        const usersCount = await User.count();
        const ordersCount = await Order.count();
        const contactsCount = await Contact.count();

        res.render('admin/dashboard', {
            sections,
            services,
            teams,
            projects,
            usersCount,
            ordersCount,
            contactsCount
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des données du tableau de bord :', error);
        res.status(500).send('Erreur interne du serveur');
    }
};

exports.getPages = async (req, res) => {
    try {
        const sections = await Section.findAll();
        const services = await Service.findAll();
        const teams = await Team.findAll();
        const projects = await Project.findAll();

        res.render('admin/pages', { 
            title: 'Gérer les Pages', 
            sections, 
            services, 
            teams, 
            projects 
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des pages :', error);
        res.status(500).send('Erreur interne du serveur');
    }
};

exports.managePage = async (req, res) => {
    const page = req.query.page || 'home';
    try {
        const sections = await Section.findAll({ where: { page } });
        const pages = await Section.findAll({
            attributes: ['page'],
            group: ['page']
        });
        res.render('managePage', { title: 'Gérer la page', sections, pages, page });
    } catch (error) {
        console.error('Erreur lors de la récupération des pages:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des pages' });
    }
};

exports.editPage = async (req, res) => {
    try {
        const pages = await Section.findAll({
            attributes: ['page'],
            group: ['page']
        });
        res.render('editPage', { pages });
    } catch (error) {
        console.error('Erreur lors de la récupération des pages:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des pages' });
    }
};


exports.getSectionsByPage = async (req, res) => {
    const { page } = req.query;
    try {
        const sections = await Section.findAll({
            where: { page },
            attributes: ['sectionName']
        });
        res.json(sections);
    } catch (error) {
        console.error('Erreur lors de la récupération des sections:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des sections' });
    }
};
exports.getVisitData = async (req, res) => {
    try {
        const visits = await Visit.findAll({ 
            attributes: [
                [sequelize.fn('date_trunc', 'day', sequelize.col('createdAt')), 'day'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['day'],
            order: [[sequelize.literal('day'), 'ASC']]
        });

        const visitData = visits.map(visit => ({
            date: visit.getDataValue('day').toLocaleDateString(),
            count: visit.getDataValue('count')
        }));

        res.json(visitData);
    } catch (error) {
        console.error('Erreur lors de la récupération des données de visites :', error);
        res.status(500).send('Erreur interne du serveur');
    }
};

const getOrderEvolution = async () => {
    const data = await Order.findAll({
        attributes: [
            [sequelize.fn('MONTH', sequelize.col('createdAt')), 'month'],
            [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['month']
    });
    return data.map(item => ({ month: item.get('month'), count: item.get('count') }));
};

const getContactEvolution = async () => {
    const data = await Contact.findAll({
        attributes: [
            [sequelize.fn('MONTH', sequelize.col('createdAt')), 'month'],
            [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['month']
    });
    return data.map(item => ({ month: item.get('month'), count: item.get('count') }));
};

exports.addSection = async (req, res) => {
    const { title, content, image, page, sectionName } = req.body;
    try {
        await Section.create({ title, content, image, page, sectionName });
        res.redirect(`/admin/manage/${page}`);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.editSection = async (req, res) => {
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
            res.redirect(`/admin/manage/${page}`);
        } else {
            res.status(404).send('Section non trouvée');
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteSection = async (req, res) => {
    const { id, page } = req.body;
    try {
        const section = await Section.findByPk(id);
        if (section) {
            await section.destroy();
            res.redirect(`/admin/manage/${page}`);
        } else {
            res.status(404).send('Section non trouvée');
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserEvolution = async () => {
    const data = await User.findAll({
        attributes: [
            [sequelize.fn('MONTH', sequelize.col('createdAt')), 'month'],
            [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['month']
    });
    return data.map(item => ({ month: item.get('month'), count: item.get('count') }));
};

const getVisitEvolution = async () => {
    const data = await Visit.findAll({
        attributes: [
            [sequelize.fn('MONTH', sequelize.col('createdAt')), 'month'],
            [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['month']
    });
    return data.map(item => ({ month: item.get('month'), count: item.get('count') }));
};

exports.getEvolutionData = async (req, res) => {
    try {
        const usersCount = await User.count();
        const ordersCount = await Order.count();
        const contactsCount = await Contact.count();

        const ordersEvolution = await Order.findAll({
            attributes: [
                [sequelize.fn('MONTH', sequelize.col('createdAt')), 'month'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['month']
        });

        const contactsEvolution = await Contact.findAll({
            attributes: [
                [sequelize.fn('MONTH', sequelize.col('createdAt')), 'month'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['month']
        });

        const usersEvolution = await User.findAll({
            attributes: [
                [sequelize.fn('MONTH', sequelize.col('createdAt')), 'month'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['month']
        });

        const visitsEvolution = await Visit.findAll({
            attributes: [
                [sequelize.fn('MONTH', sequelize.col('createdAt')), 'month'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['month']
        });

        res.json({
            usersCount,
            ordersCount,
            contactsCount,
            ordersEvolution: ordersEvolution.map(item => item.get({ plain: true })),
            contactsEvolution: contactsEvolution.map(item => item.get({ plain: true })),
            usersEvolution: usersEvolution.map(item => item.get({ plain: true })),
            visitsEvolution: visitsEvolution.map(item => item.get({ plain: true }))
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des données d\'évolution :', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getUsers = async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    if (req.session.userRole !== 'admin') {
        return res.status(403).send('Accès refusé');
    }
    try {
        const users = await User.findAll({ attributes: { exclude: ['role'] } }); // Exclure le rôle des utilisateurs
        res.render('admin/users', { title: 'Gestion des Utilisateurs - Dincosarl', users });
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
        res.status(500).send('Erreur interne du serveur');
    }
};

exports.getContacts = async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    if (req.session.userRole !== 'admin') {
        return res.status(403).send('Accès refusé');
    }
    try {
        const contacts = await Contact.findAll();
        res.render('admin/contacts', { title: 'Gestion des Contacts - Dincosarl', contacts });
    } catch (error) {
        console.error('Erreur lors de la récupération des contacts :', error);
        res.status(500).send('Erreur interne du serveur');
    }
};

exports.getHome = async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    if (req.session.userRole !== 'admin') {
        return res.status(403).send('Accès refusé');
    }
    try {
        const sections = await Section.findAll();
        res.render('admin/home', { title: 'Accueil Admin - Dincosarl', sections });
    } catch (error) {
        console.error('Erreur lors de la récupération des sections :', error);
        res.status(500).send('Erreur interne du serveur');
    }
};

exports.getLogin = (req, res) => {
    if (req.session.userId) {
        return res.redirect('/admin/home');
    }
    res.render('admin/login', { title: 'Connexion - Dincosarl' });
};

exports.postLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ error: 'Identifiants incorrects' });
        }

        req.session.userId = user.id;
        req.session.userRole = user.role;

        res.json({ message: 'Connexion réussie' });
    } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        res.status(500).json({ error: error.message });
    }
};

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
};
