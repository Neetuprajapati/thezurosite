const express = require("express");
const router = express.Router();

// ✅ Sab functions import karo
const {
  register,
  login,
  forgotPassword,
  resendOtp,
  sendLoginOtp,   // ✅ Fix: pehle import nahi tha
  verifyLoginOtp, // ✅ Fix: pehle import nahi tha
} = require("../controller/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/forgot", forgotPassword);
router.post("/resend-otp", resendOtp);

// ✅ Fix: route names frontend ke saath match karte hain
router.post("/send-login-otp", sendLoginOtp);
router.post("/verify-login-otp", verifyLoginOtp);

module.exports = router;