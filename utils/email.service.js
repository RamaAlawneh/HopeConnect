const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // أو أي خدمة أخرى
  auth: {
    user: 'your_email@gmail.com',
    pass: 'your_email_password_or_app_password'
  }
});

exports.sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: 'your_email@gmail.com',
    to,
    subject,
    text
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('Error sending email:', err);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};
