const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const teamController = require('../controllers/teamController');
const serviceController = require('../controllers/serviceController');
const dashboardController = require('../controllers/dashboardController');
const pageController = require('../controllers/pageController');
const productController = require('../controllers/productController');
const partnerController = require('../controllers/partnerController');
const upload = require('../config/multer'); // Import correct

// Routes pour gérer les services
router.get('/services', serviceController.getServicePage);
router.post('/create-service', upload.single('image'), serviceController.createService);
router.post('/edit-service', upload.single('image'), serviceController.editService);
router.post('/delete-service', serviceController.deleteService);

// Routes pour gérer les partenaires
router.get('/partners', partnerController.getPartners);
router.get('/partnersJson', partnerController.getPartnersJson);
router.post('/partners/add', upload.single('image'), partnerController.createPartner);
router.post('/partners/edit/:id', upload.single('image'), partnerController.updatePartner);
router.post('/partners/delete', partnerController.deletePartner);

// Routes pour gérer les sections
router.get('/dashboard', adminController.getDashboard);
router.post('/add-section', upload.single('image'), adminController.addSection);
router.post('/edit-section', upload.single('image'), adminController.editSection);
router.post('/delete-section', adminController.deleteSection);

// Route pour gérer les utilisateurs
router.get('/users', adminController.getUsers);
router.get('/logout', adminController.logout);

// Route pour gérer les pages dans l'admin
router.get('/pages', adminController.getPages);

// Routes pour les pages publiques
router.get('/home', pageController.getHomePage);
router.get('/project', pageController.getProject);
router.get('/service', pageController.getService);
router.get('/team', pageController.getTeam);
router.get('/blog', pageController.getBlog);
router.get('/contact-us', pageController.getContactUs);

router.get('/pages/:page', adminController.managePage);
router.get('/manage/:page', pageController.getManagePage);
router.post('/manage/add-section', upload.single('image'), pageController.addSection);
router.post('/manage/edit-section', upload.single('image'), pageController.editSection);
router.post('/manage/delete-section', pageController.deleteSection);
router.post('/manage/add-page', pageController.addPage);

router.get('/visit-data', dashboardController.getVisitData);
router.get('/contacts', adminController.getContacts);
router.get('/edit-page', adminController.editPage);

// Nouvelles routes pour les équipes
router.post('/manage/add-team', upload.single('image'), pageController.addTeam);
router.post('/manage/edit-team', upload.single('image'), pageController.editTeam);
router.post('/manage/delete-team', pageController.deleteTeam);

// Nouvelles routes pour les projets
router.post('/manage/add-project', upload.fields([{ name: 'mainImage', maxCount: 1 }, { name: 'images', maxCount: 10 }]), pageController.addProject);
router.post('/manage/edit-project', upload.fields([{ name: 'mainImage', maxCount: 1 }, { name: 'images', maxCount: 10 }]), pageController.editProject);
router.post('/manage/delete-project', pageController.deleteProject);

// Routes pour gérer les produits
router.get('/products', productController.getProductsByCategory);
router.get('/products/:category/:id', productController.getProductById);
router.post('/add-product', upload.single('image'), productController.addProduct);
router.post('/edit-products', upload.single('image'), productController.editProduct);
router.post('/delete-product', productController.deleteProduct);

module.exports = router;
