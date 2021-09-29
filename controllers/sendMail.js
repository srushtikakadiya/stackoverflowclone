const nodemailer = require('nodemailer')

const {
  MAIL_PASSWORD,
  MAIL_ADDRESS
} = process.env


let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: MAIL_ADDRESS,
    pass: MAIL_PASSWORD
  }
});




const sendEmail = (to, url, txt) => {
  let mailOptions = {
    from: "Full Stack Overflow Clone",
    to,
    subject: txt,
    text: `
    Full Stack Overflow Clone MSG for ${txt}:
    ${url}
    `
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

module.exports = sendEmail