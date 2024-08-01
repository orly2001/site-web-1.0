const Partner = require('../models/partnerModel');

// Retrieve all partners and render them
exports.getPartners = async (req, res) => {
    try {
        const partners = await Partner.findAll();
        res.render('admin/partners', { title: 'Nos Partenaires - Dincosarl', partners });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Retrieve all partners in JSON format
exports.getPartnersJson = async (req, res) => {
    try {
        const partners = await Partner.findAll();
        res.json(partners);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a new partner
exports.createPartner = async (req, res) => {
    const { name } = req.body;
    const image = req.file ? `/images/${req.file.filename}` : null;
    try {
        await Partner.create({ name, image });
        res.status(201).json({ message: 'Partner created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update an existing partner
exports.updatePartner = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const image = req.file ? `/images/${req.file.filename}` : null;
    try {
        const partner = await Partner.findByPk(id);
        if (partner) {
            partner.name = name;
            if (image) {
                partner.image = image;
            }
            await partner.save();
            res.status(200).json(partner);
        } else {
            res.status(404).json({ error: 'Partner not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a partner
exports.deletePartner = async (req, res) => {
    const { id } = req.body;
    try {
        const partner = await Partner.findByPk(id);
        if (partner) {
            await partner.destroy();
            res.json({ message: 'Partner deleted successfully' });
        } else {
            res.status(404).json({ error: 'Partner not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
