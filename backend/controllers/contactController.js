// controllers/contactController.js
const sendMail = require('../utils/mailer');
const Contact = require('../models/contactModel');

const handleContactForm = async (req, res) => {
    const { name, email, projectType, message } = req.body;

    try {
        // Envoyer un e-mail de confirmation
        const subject = 'Nouveau message de contact';
        const text = `
            Nom: ${name}
            Email: ${email}
            Type de projet: ${projectType}
            Message: ${message}
        `;

        await sendMail(email, subject, text);

        // Enregistrer le contact dans la base de données uniquement si l'email est envoyé avec succès
        await Contact.create({ name, email, projectType, message });

        res.render('contact-us', { success: 'Votre message a été envoyé avec succès!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.render('contact-us', { error: 'Une erreur s\'est produite lors de l\'envoi du message.' });
    }
};

module.exports = {
    handleContactForm
};
