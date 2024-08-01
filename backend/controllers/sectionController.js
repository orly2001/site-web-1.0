const Section = require('../models/sectionModel');

const getSections = async (req, res) => {
    try {
        const sections = await Section.findAll();
        res.status(200).json(sections);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createSection = async (req, res) => {
    try {
        const section = await Section.create(req.body);
        res.status(201).json(section);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateSection = async (req, res) => {
    try {
        console.log('Updating section ' + req.body)
        const section = await Section.update(req.body, { where: { id: req.params.id } });
        res.status(200).json(section);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSectionsByPage = async (req, res) => {
    const page = req.query.page;

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

const deleteSection = async (req, res) => {
    try {
        await Section.destroy({ where: { id: req.params.id } });
        res.status(200).json({ message: 'Section deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getSections,
    createSection,
    updateSection,
    deleteSection
};
