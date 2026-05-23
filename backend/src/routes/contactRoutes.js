const express = require("express");
const router = express.Router();
const { sendEmail } = require("../utils/brevoEmail");

router.post("/send-email", async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  const html = `
    <p><b>Name:</b> ${name}</p>
    <p><b>Email:</b> ${email}</p>
    <p><b>Phone:</b> ${phone || "Not provided"}</p>
    <p><b>Subject:</b> ${subject || "No subject"}</p>
    <p><b>Message:</b> ${message}</p>
  `;
  await sendEmail("thezuro22@gmail.com", subject || "[TheZuro] New Contact Message", html);
  return res.json({ success: true });
});

module.exports = router;