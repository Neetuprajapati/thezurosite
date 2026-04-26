const SibApiV3Sdk = require("sib-api-v3-sdk");

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
const sendEmail = async (to, subject, html) => {
    try {
      const response = await apiInstance.sendTransacEmail({
        sender: {
          email: "thezuro22@gmail.com",
          name: "TheZuro",
        },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      });
  
      console.log("✅ EMAIL RESPONSE:");
      console.log(response);
  
    } catch (err) {
      console.log("❌ FULL EMAIL ERROR:");
      console.log(JSON.stringify(err.response?.body || err, null, 2));
    }
  };

module.exports = { sendEmail };