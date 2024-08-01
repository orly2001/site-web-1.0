const sequelize = require('../config/database');
const User = require('../models/userModel');
const Order = require('../Pour créer un tableau de bord qui gère le site de Dinco et affiche des statistiques, nous allons adapter votre `adminController.js` pour inclure toutes les données nécessaires et créer une vue `dashboard.ejs` qui présente ces informations.

### `adminController.js`

Ajoutez toutes les données nécessaires dans le contrôleur:

```javascript
const Section = require('../models/sectionModel');
const User = require('../models/userModel');
const Order = require('../models/orderModel'); 
const Contact = require('../models/contactModel');
const bcrypt = require('bcrypt');

// Gérer l'affichage du tableau de bord
const getDashboard = async (req, res) => {
    try {
        const sections = await Section.findAll();
        const usersCount = await User.count();
        const ordersCount = await Order.count();
        const contactsCount = await Contact.count(); // Assurez-vous que ce modèle est correctement défini

        res.render('admin/dashboard', {
            title: 'Tableau de bord',
            sections,
            usersCount,
            ordersCount,
            contactsCount
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).send('Internal Server Error');
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
    deleteSection
};
