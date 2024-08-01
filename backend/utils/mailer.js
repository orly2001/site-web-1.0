// utils/mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'yvanjuniortchoudjidombou@gmail.com',
        pass: 'cxwb vgbu yail fqvo'
    }
});

const sendMail = (to, subject, text) => {
    const mailOptions = {
        from: 'tutoregroupe6@gmail.com',
        to,
        subject,
        text
    };

    return transporter.sendMail(mailOptions);
};

module.exports = sendMail;
