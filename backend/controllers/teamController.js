const Team = require('../models/Team');



const getTeamPage = async (req, res) => {
    try {
        const teams = await Team.findAll();
        res.render('team', { teams });
    } catch (error) {
        console.error('Erreur lors de la récupération des données des équipes:', error);
        res.status(500).send('Erreur interne du serveur');
    }
};

const createTeamMember = async (req, res) => {
    try {
        const { name, role, image, facebook, instagram, twitter, github } = req.body;
        await Team.create({ name, role, image, facebook, instagram, twitter, github });
        res.redirect('/admin/team');
    } catch (error) {
        console.error('Erreur lors de la création du membre de l\'équipe:', error);
        res.status(500).send('Erreur interne du serveur');
    }
};

const editTeamMember = async (req, res) => {
    try {
        const { id, name, role, image, facebook, instagram, twitter, github } = req.body;
        await Team.update({ name, role, image, facebook, instagram, twitter, github }, { where: { id } });
        res.redirect('/admin/team');
    } catch (error) {
        console.error('Erreur lors de la mise à jour du membre de l\'équipe:', error);
        res.status(500).send('Erreur interne du serveur');
    }
};

const deleteTeamMember = async (req, res) => {
    try {
        const { id } = req.body;
        await Team.destroy({ where: { id } });
        res.redirect('/admin/team');
    } catch (error) {
        console.error('Erreur lors de la suppression du membre de l\'équipe:', error);
        res.status(500).send('Erreur interne du serveur');
    }
};

module.exports = {
    getTeamPage,
    createTeamMember,
    editTeamMember,
    deleteTeamMember
};
