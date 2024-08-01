// controllers/serviceController.js
const Service = require('../models/Service');

exports.getServices = async (req, res) => {
    try {
        const services = await Service.findAll();
        res.render('service', { title: 'Services - DINCO SARL', services });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getServicePage = async (req, res) => {
    try {
        const services = await Service.findAll();
        res.render('team', { services });
    } catch (error) {
        console.error('Erreur lors de la récupération des données des services:', error);
        res.status(500).send('Erreur interne du serveur');
    }
};

const createService = async (req, res) => {
    try {
        const { title, description, image } = req.body;
        await Service.create({ title, description, image });
        res.redirect('/admin/services');
    } catch (error) {
        console.error('Erreur lors de la création du service:', error);
        res.status(500).send('Erreur interne du serveur');
    }
};

const editService = async (req, res) => {
    try {
        const { id, title, description, image } = req.body;
        await Service.update({ title, description, image }, { where: { id } });
        res.redirect('/admin/services');
    } catch (error) {
        console.error('Erreur lors de la mise à jour du service:', error);
        res.status(500).send('Erreur interne du serveur');
    }
};

const deleteService = async (req, res) => {
    try {
        const { id } = req.body;
        await Service.destroy({ where: { id } });
        res.redirect('/admin/services');
    } catch (error) {
        console.error('Erreur lors de la suppression du service:', error);
        res.status(500).send('Erreur interne du serveur');
    }
};

module.exports = {
    getServicePage,
    createService,
    editService,
    deleteService
};
