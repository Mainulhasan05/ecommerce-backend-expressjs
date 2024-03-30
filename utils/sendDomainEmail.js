const nodemailer = require('nodemailer');

const createTransport = () => {
    return nodemailer.createTransport({
        host: process.env.DOMAIN_HOST,
        port: 465, 
        secure: true, 
        auth: {
            user: process.env.DOMAIN_EMAIL,
            pass: process.env.DOMAIN_MAIL_PASS
        }
    });
  }


const sendDomainEmail = async (email,subject,body) => {
    
    const transporter = createTransport();
    
    const mailOptions = {
        from:`"SuchonaMart" <${process.env.DOMAIN_EMAIL}>`,
        to: email,
        subject: subject,
        html: body,
    };
    await transporter.sendMail(mailOptions)
    .then((info)=>{
        console.log('Email sent: ' + info.response);
    })
    .catch((error)=>{
        console.log('Error sending email:',error);
    });
};

module.exports = sendDomainEmail;