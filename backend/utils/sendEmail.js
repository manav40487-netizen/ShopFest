const axios = require("axios");

const sendEmail = async ({ email, subject, message }) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "ShopFest Support",
          email: process.env.SENDER_EMAIL,
        },
        to: [
          {
            email: email,
          },
        ],
        subject: subject,
        htmlContent: message,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Email sent successfully");
    console.log(response.data);

  } catch (error) {

    console.error("❌ Email Error");

    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }

  }
};

module.exports = sendEmail;