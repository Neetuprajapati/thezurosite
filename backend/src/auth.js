const express = require("express");
const router = express.Router();
const pool = require("./db");
const bcrypt = require("bcrypt");


// ✅ SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { full_name, email, phone, password } = req.body;

    const check = await pool.query(
      "SELECT * FROM users WHERE email=$1 OR phone=$2",
      [email, phone]
    );

    if (check.rows.length > 0) {
      return res.json({ message: "User already exists, please login" });
    }

    const hash = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (full_name, email, phone, password_hash)
       VALUES ($1,$2,$3,$4)`,
      [full_name, email, phone, hash]
    );

    res.json({ message: "Signup successful" });

  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
});


// ✅ LOGIN (email + password)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  if (user.rows.length === 0) {
    return res.json({ message: "User not found" });
  }

  const match = await bcrypt.compare(password, user.rows[0].password_hash);

  if (!match) {
    return res.json({ message: "Wrong password" });
  }

  res.json({ message: "Login successful" });
});


// ✅ SEND OTP
router.post("/send-otp", async (req, res) => {
  const { phone } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000);

  await pool.query(
    `INSERT INTO otp_tokens(identifier, otp_code, purpose, expires_at)
     VALUES ($1,$2,'login', NOW() + INTERVAL '5 minutes')`,
    [phone, otp]
  );

  console.log("OTP:", otp);

  res.json({ message: "OTP sent" });
});


// ✅ VERIFY OTP
router.post("/verify-otp", async (req, res) => {
  const { phone, otp } = req.body;

  const result = await pool.query(
    `SELECT * FROM otp_tokens 
     WHERE identifier=$1 AND otp_code=$2 AND is_used=false
     ORDER BY created_at DESC LIMIT 1`,
    [phone, otp]
  );

  if (result.rows.length === 0) {
    return res.json({ message: "Invalid OTP" });
  }

  res.json({ message: "Login success via OTP" });
});

module.exports = router;