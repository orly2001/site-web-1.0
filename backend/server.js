const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const sequelize = require('./config/database');
const sectionRoutes = require('./routes/sectionRoutes');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/authRoutes');
const pageRoutes = require('./routes/pageRoutes');
const contactRoutes = require('./routes/contactRoutes');
const productController = require('./controllers/productController');
const User = require('./models/userModel');
const bcrypt = require('bcrypt');
const multer = require('multer');
const fs = require('fs');
const upload = require('./config/multer');
const app = express(); 
const cors = require('cors');

// Middleware for header data
app.use(productController.getHeaderData);
// Charger les variables d'environnement depuis un fichier .env
//dotenv.config();

//const upload = multer({ storage: storage });



// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(express.static(path.join(__dirname, '../frontend/public')));
app.set('views', path.join(__dirname, '../frontend/views'));
app.set('view engine', 'ejs');

// Routes
app.use('/api/sections', sectionRoutes);
app.use('/admin', adminRoutes);
app.use('/', authRoutes);
app.use('/', pageRoutes);
app.use('/', contactRoutes);

let partners = [];

// Route pour télécharger une image et ajouter un partenaire
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Veuillez télécharger une image.' });
    }
    const newPartner = { id: Date.now(), name: req.body.name, image: `/uploads/images/${req.file.filename}` };
    partners.push(newPartner);
    res.status(200).json({ message: 'Image téléchargée avec succès.', file: req.file, partner: newPartner });
});

// Route pour récupérer tous les partenaires
app.get('/api/partners', (req, res) => {
    res.json(partners);
});

// Route pour accéder à une image par son nom de fichier
app.get('/images/:filename', (req, res) => {
    console.log("le nom du fichier est " + req.params.filename);
    const filePath = path.join(__dirname, 'uploads', 'images', req.params.filename);
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).json({ message: 'Image non trouvée.' });
        }
        res.sendFile(filePath);
    });
});



app.listen(3000, async () => {
    console.log('Server is running on port 3000');
    
    try {
        await sequelize.sync();
        console.log('Database connected and synchronized!');

        // Vérifiez si l'utilisateur admin existe déjà
        const adminUser = await User.findOne({ where: { email: 'user@gmail.com' } });
        if (!adminUser) {
            // Initialisation de la base de données avec un utilisateur par défaut
            const hashedPassword = await bcrypt.hash('123456789', 10);
            await User.create({
                firstName: 'toker',
                lastName: 'user',
                dateOfBirth: new Date(),
                company: 'incosarl',
                phoneNumber: '0000000000',
                email: 'user@gmail.com',
                password: hashedPassword,
                role: 'user'
            });
            console.log('Default admin user created!');
        }

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});
