const nodemailer = require('nodemailer');

// create a transporter, https://nodemailer.com/usage/
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_SERVICE_USER,
        pass: process.env.EMAIL_SERVICE_PASS,
    }
})

module.exports = transporter;