require('dotenv').config();
const nodemailer = require("nodemailer");

async function sendMail(to, subject, htmlContent){
    try {
        let transporter = nodemailer.createTransport({
            host:  process.env.MAIL_HOST,
            port:  process.env.MAIL_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
              user: process.env.MAIL_USERNAME, // generated ethereal user
              pass:  process.env.MAIL_PASSWORD, // generated ethereal password
            },
            
        });
        const mailOptions = { // thiết lập đối tượng, nội dung gửi mail
            from: process.env.MAIL_USERNAME,
            to: to,
            subject: subject,
            text: 'You recieved message from ' +  process.env.MAIL_USERNAME,
            html: htmlContent
        }
        const info = await transporter.sendMail(mailOptions);

    } catch (error) {
        console.log(error)
    }
    

}

module.exports.sendMail = sendMail