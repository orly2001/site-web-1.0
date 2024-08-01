const Service = require('../models/Service');
const Section = require('../models/sectionModel');
const Team = require('../models/Team');
const Project = require('../models/projectModel');
const ProjectImage = require('../models/projectImageModel');
const Partner = require('../models/partnerModel');
const User = require('../models/userModel');
const Contact = require('../models/contactModel');
const AllSection = require('../models/allSectionModel');
const path = require('path');
const fs = require('fs');
const upload = require('../config/multer');

const getHomePage = async (req, res) => {
    try {
        const sections = await Section.findAll({ where: { page: 'home' }, order: [['id', 'ASC']] });
        const partners = await Partner.findAll(); // Fetch partners
        res.render('index', { title: 'Accueil - Dincosarl', sections, partners });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getProject = async (req, res) => {
    try {
        const projects = await Project.findAll({ include: [{ model: ProjectImage, as: 'images' }] });
        projects.forEach(project => {
            project.startDate = project.startDate ? new Date(project.startDate) : null;
            project.endDate = project.endDate ? new Date(project.endDate) : null;
        });
        const partners = await Partner.findAll(); // Fetch partners
        res.render('project', { title: 'Projets - Dincosarl', projects, partners });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getService = async (req, res) => {
    try {
        const sections = await Section.findAll({ where: { page: 'service' } });
        const services = await Service.findAll();
        const partners = await Partner.findAll(); // Fetch partners
        res.render('service', { title: 'Service - Dincosarl', sections, services, partners });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getTeam = async (req, res) => {
    try {
        const sections = await Section.findAll({ where: { page: 'team' } });
        const teams = await Team.findAll();
        const partners = await Partner.findAll(); // Fetch partners
        res.render('team', { title: 'Équipe - Dincosarl', sections, teams, partners });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getBlog = async (req, res) => {
    try {
        const partners = await Partner.findAll(); // Fetch partners
        res.render('blog', { title: 'Blog - Dincosarl', partners });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getContactUs = async (req, res) => {
    try {
        const sections = await Section.findAll({ where: { page: 'contact-us' } });
        const contacts = await Contact.findAll();
        const partners = await Partner.findAll(); // Fetch partners
        res.render('contact-us', { title: 'Contactez-nous - Dincosarl', sections, contacts, partners });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getLogin = async (req, res) => {
    try {
        const sections = await Section.findAll({ where: { page: 'login' } });
        const users = await User.findAll();
        const partners = await Partner.findAll(); // Fetch partners
        res.render('login', { title: 'Connexion - Dincosarl', sections, users, partners });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getManagePage = async (req, res) => {
    const { page } = req.params;
    try {
        const allSections = await AllSection.findAll({
            attributes: ['page', 'sectionName']
        });

        let sections = [];
        let additionalData = {};

        switch (page) {
            case 'home':
                sections = await Section.findAll({ where: { page: 'home' } });
                break;
            case 'team':
                sections = await Section.findAll({ where: { page: 'team' } });
                additionalData.teams = await Team.findAll();
                break;
            case 'service':
                sections = await Section.findAll({ where: { page: 'service' } });
                additionalData.services = await Service.findAll();
                break;
            case 'project':
                sections = await Section.findAll({ where: { page: 'project' } });
                additionalData.projects = await Project.findAll({ include: [{ model: ProjectImage, as: 'images' }] });
                additionalData.projects.forEach(project => {
                    project.startDate = project.startDate ? new Date(project.startDate) : null;
                    project.endDate = project.endDate ? new Date(project.endDate) : null;
                });
                break;
            case 'contact-us':
                sections = await Section.findAll({ where: { page: 'contact-us' } });
                additionalData.contacts = await Contact.findAll();
                break;
            case 'login':
                sections = await Section.findAll({ where: { page: 'login' } });
                additionalData.users = await User.findAll();
                break;
            default:
                sections = await Section.findAll({ where: { page } });
        }

        res.render('admin/managePage', { title: `Gestion de ${page}`, sections, allSections, page, ...additionalData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addSection = async (req, res) => {
    const { title, content, page, sectionName } = req.body;
    const image = req.file ? `/images/${req.file.filename}` : null;
    try {
        const existingSection = await Section.findOne({ where: { title, content, image, page, sectionName } });
        if (!existingSection) {
            await Section.create({ title, content, image, page, sectionName });
        }
        res.redirect(`/admin/manage/${page}`);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const editSection = async (req, res) => {
    console.log('before')
    const { id, title, content, page, sectionName } = req.body;
    console.log('Edit section ', req.body)
    console.log('in ' + req.file.filename)
    const image = req.file ? `/images/${req.file.filename}` : null;
    console.log('after')
    try {
        const section = await Section.findByPk(id);
        if (section) {
            section.title = title;
            section.content = content;
            if (image) {
                section.image = image;
            }
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

const deleteSection = async (req, res) => {
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

const addPage = async (req, res) => {
    const { title, pageName } = req.body;
    try {
        await Section.create({ title, page: pageName });
        res.redirect(`/admin/manage/${pageName}`);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addTeam = async (req, res) => {
    const { name, role, facebook, instagram, twitter, github } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    try {
        await Team.create({ name, role, image, facebook, instagram, twitter, github });
        res.redirect(`/admin/manage/team`);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const editTeam = async (req, res) => {
    const { id, name, role, facebook, instagram, twitter, github } = req.body;
    const image = req.file ? `/images/${req.file.filename}` : null;
    try {
        const team = await Team.findByPk(id);
        if (team) {
            team.name = name;
            team.role = role;
            if (image) {
                team.image = image;
            }
            team.facebook = facebook;
            team.instagram = instagram;
            team.twitter = twitter;
            team.github = github;
            await team.save();
            res.redirect(`/admin/manage/team`);
        } else {
            res.status(404).send('Équipe non trouvée');
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteTeam = async (req, res) => {
    const { id } = req.body;
    try {
        const team = await Team.findByPk(id);
        if (team) {
            await team.destroy();
            res.redirect(`/admin/manage/team`);
        } else {
            res.status(404).send('Équipe non trouvée');
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addService = async (req, res) => {
    const { title, description } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    try {
        await Service.create({ title, description, image });
        res.redirect(`/admin/manage/service`);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const editService = async (req, res) => {
    const { id, title, description } = req.body;
    const image = req.file ? `/images/${req.file.filename}` : null;
    try {
        const service = await Service.findByPk(id);
        if (service) {
            service.title = title;
            service.description = description;
            if (image) {
                service.image = image;
            }
            await service.save();
            res.redirect(`/admin/manage/service`);
        } else {
            res.status(404).send('Service non trouvé');
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteService = async (req, res) => {
    const { id } = req.body;
    try {
        const service = await Service.findByPk(id);
        if (service) {
            await service.destroy();
            res.redirect(`/admin/manage/service`);
        } else {
            res.status(404).send('Service non trouvé');
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addProject = async (req, res) => {
    const { title, description, status, startDate, endDate } = req.body;
    const mainImage = req.files.mainImage ? `/images/${req.files.mainImage[0].filename}` : null;
    const images = req.files.images ? req.files.images.map(file => ({ imageUrl: `/uploads/${file.filename}` })) : [];
    try {
        const project = await Project.create({ title, description, mainImage, status, startDate, endDate });
        if (images.length > 0) {
            await ProjectImage.bulkCreate(images.map(img => ({ projectId: project.id, imageUrl: img.imageUrl })));
        }
        res.redirect(`/admin/manage/project`);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const editProject = async (req, res) => {
    const { id, title, description, status, startDate, endDate } = req.body;
    const mainImage = req.files.mainImage ? `/uploads/${req.files.mainImage[0].filename}` : null;
    const images = req.files.images ? req.files.images.map(file => ({ imageUrl: `/uploads/${file.filename}` })) : [];
    try {
        const project = await Project.findByPk(id);
        if (project) {
            project.title = title;
            project.description = description;
            if (mainImage) {
                project.mainImage = mainImage;
            }
            project.status = status;
            project.startDate = startDate;
            project.endDate = endDate;
            await project.save();
            if (images.length > 0) {
                await ProjectImage.destroy({ where: { projectId: id } });
                await ProjectImage.bulkCreate(images.map(img => ({ projectId: id, imageUrl: img.imageUrl })));
            }
            res.redirect(`/admin/manage/project`);
        } else {
            res.status(404).send('Projet non trouvé');
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteProject = async (req, res) => {
    const { id } = req.body;
    try {
        const project = await Project.findByPk(id);
        if (project) {
            await project.destroy();
            res.redirect(`/admin/manage/project`);
        } else {
            res.status(404).send('Projet non trouvé');
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getHomePage,
    getProject,
    getService,
    getTeam,
    getBlog,
    getContactUs,
    getLogin,
    getManagePage,
    addSection: [upload.single('image'), addSection],
    editSection: [upload.single('image'), editSection],
    deleteSection,
    addPage,
    addTeam: [upload.single('image'), addTeam],
    editTeam: [upload.single('image'), editTeam],
    deleteTeam,
    addService: [upload.single('image'), addService],
    editService: [upload.single('image'), editService],
    deleteService,
    addProject: [upload.fields([{ name: 'mainImage', maxCount: 1 }, { name: 'images', maxCount: 10 }]), addProject],
    editProject: [upload.fields([{ name: 'mainImage', maxCount: 1 }, { name: 'images', maxCount: 10 }]), editProject],
    deleteProject
};
