const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const pageController = require('../controllers/pageController');

// Routes pour le tableau de bord
router.get('/dashboard', adminController.getDashboard);
router.get('/dashboard/evolution-data', adminController.getEvolutionData);

// Routes pour gérer les sections
router.post('/add-section', adminController.addSection);
router.post('/edit-section', adminController.editSection);
router.post('/delete-section', adminController.deleteSection);

// Routes pour les pages dans l'admin
router.get('/pages', adminController.getPages);

// Routes pour les pages publiques
router.get('/', pageController.getHomePage);
router.get('/project', pageController.getProject);
router.get('/service', pageController.getService);
router.get('/team', pageController.getTeam);
router.get('/blog', pageController.getBlog);
router.get('/contact-us', pageController.getContactUs);
router.get('/manage/:page', pageController.getManagePage);
router.get('/manage/contact-us', pageController.getManagePage);
router.post('/manage/add-section', pageController.addSection);
router.post('/manage/edit-section', pageController.editSection);
router.post('/manage/delete-section', pageController.deleteSection);
router.post('/manage/add-page', pageController.addPage);



module.exports = router;
