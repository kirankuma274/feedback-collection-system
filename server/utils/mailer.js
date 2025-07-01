const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.EMAIL_PASSWORD
  }
});

exports.sendFeedbackEmail = async (to, subject, text, html) => {
  const mailOptions = {
    from: `"Team Kiran" <${process.env.EMAIL_SENDER}>`,
    to,
    subject,
    text,
    html  
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.response);
    return info;
  } catch (error) {
    console.error('❌ Email error:', error.message);
    throw error;
  }
};