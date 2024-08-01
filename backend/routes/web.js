// backend/routes/web.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index');
});
router.get('/project', (req, res) => {
    res.render('project');
});
router.get('/service', (req, res) => {
    res.render('service');
});
router.get('/team', (req, res) => {
    res.render('team');
});
router.get('/blog', (req, res) => {
    res.render('blog');
});
router.get('/contact-us', (req, res) => {
    res.render('contact-us');
});

module.exports = router;
