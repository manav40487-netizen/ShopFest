const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // false for port 587
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS,
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.error(error);
  } else {
    console.log("✅ Brevo SMTP is ready");
  }
});

const sendEmail = async ({ email, subject, message }) => {
  try {
    const info = await transporter.sendMail({
      from: `"ShopFest Support" <${process.env.SENDER_EMAIL}>`,
      to: email,
      subject: subject,
      html: message,
    });

    console.log(`✅ Email successfully sent to ${email}`);
    console.log("Message ID:", info.messageId);
  } catch (error) {
    console.error(`❌ Failed to send email to ${email}`);
    console.error(error);
  }
};

module.exports = sendEmail;