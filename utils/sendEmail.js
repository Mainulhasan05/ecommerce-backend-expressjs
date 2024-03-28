const nodemailer = require('nodemailer');
require('dotenv').config();

const createTransport = () => {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.MAIL_PASS
      }
    });
  }

  const sendEmail = async (email,subject,body) => {
    
    const transporter = createTransport();
    const mailOptions = {
        from:`"Suchona Mart" <${process.env.SENDER_EMAIL}>`,
        to: email,
        subject: subject,
        html: body,
    };
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;