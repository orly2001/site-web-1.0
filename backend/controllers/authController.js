// /backend/controllers/authController.js
const User = require('../models/userModel');
const Section = require('../models/sectionModel');
const Order = require('../models/orderModel'); // Importer le modèle Order
const Contact = require('../models/contactModel'); // Importer le modèle Contact
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');

// Afficher la page de connexion
const getLogin = (req, res) => {
    res.render('login', { title: 'Connexion - Dincosarl' });
};

// Gestion de la soumission du formulaire de connexion
const postLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (user) {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                req.session.userId = user.id;
                req.session.userRole = user.role;
                res.redirect('/dashboard');
            } else {
                res.status(401).send('Email ou mot de passe incorrect');
            }
        } else {
            res.status(401).send('Email ou mot de passe incorrect');
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Afficher la page d'inscription
const getRegister = (req, res) => {
    res.render('register', { title: 'Inscription - Dincosarl' });
};

// Gestion de la soumission du formulaire d'inscription
const postRegister = [
    body('firstName').notEmpty().withMessage('Le prénom est requis'),
    body('lastName').notEmpty().withMessage('Le nom est requis'),
    body('dateOfBirth').isDate().withMessage('Date de naissance invalide'),
    body('phoneNumber').isMobilePhone().withMessage('Numéro de téléphone invalide'),
    body('email').isEmail().withMessage('Email invalide'),
    body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { firstName, lastName, dateOfBirth, company, phoneNumber, email, password } = req.body;
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            await User.create({ firstName, lastName, dateOfBirth, company, phoneNumber, email, password: hashedPassword, role: 'user' });
            res.redirect('/login');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
];

// Afficher la page du tableau de bord
const getDashboard = async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    if (req.session.userRole !== 'admin') {
        return res.status(403).send('Accès refusé');
    }
    try {
        const sections = await Section.findAll();
        const usersCount = await User.count(); // Utilisez Sequelize pour compter les utilisateurs
        // Ajoutez des comptes pour les commandes et les contacts si nécessaires, par exemple:
        const ordersCount = await Order.count(); // Si vous avez un modèle Order
        const contactsCount = await Contact.count(); // Si vous avez un modèle Contact
        res.render('admin/dashboard', { 
            title: 'Tableau de bord Admin - Dincosarl', 
            sections, 
            usersCount,
            ordersCount,
            contactsCount
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Déconnexion
const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Erreur interne du serveur');
        }
        res.redirect('/login');
    });
};

module.exports = {
    getLogin,
    postLogin,
    getRegister,
    postRegister,
    getDashboard,
    logout
};
