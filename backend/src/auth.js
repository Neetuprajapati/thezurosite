require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const express    = require("express");
const router     = express.Router();
const pool       = require("./db");
const bcrypt     = require("bcrypt");
const jwt        = require("jsonwebtoken");
const { Resend } = require("resend");

const resend       = new Resend(process.env.RESEND_API_KEY);
const JWT_SECRET   = process.env.JWT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL;

// ── Email bhejo ──
const sendEmail = async (to, subject, html) => {
  try {
    await resend.emails.send({
      from: "TheZuro <onboarding@resend.dev>",
      to,
      subject,
      html,
    });
    console.log(`✅ Email sent to: ${to}`);
  } catch (err) {
    console.error("❌ Email error:", err.message);
  }
};

// ── Welcome Email Template ──
const welcomeTemplate = (name, email) => `
  <div style="font-family:sans-serif;max-width:500px;margin:auto;padding:32px;border:1px solid #eee;border-radius:12px">
    <h1 style="color:#9400D3;text-align:center">TheZuro 🛍</h1>
    <h2 style="color:#1a1a2e">Welcome, ${name}! 🎉</h2>
    <p style="color:#555">Your account has been successfully created.</p>
    <div style="background:#f8f4ff;border-radius:12px;padding:20px;margin:20px 0">
      <p style="margin:0;color:#555">📧 Email: <strong>${email}</strong></p>
    </div>
    <div style="background:linear-gradient(135deg,#9400D3,#ED80E9);border-radius:12px;padding:20px;text-align:center;margin:20px 0">
      <p style="color:#fff;font-size:13px;margin:0 0 6px">🎁 Welcome Gift!</p>
      <p style="color:#fff;font-size:24px;font-weight:700;letter-spacing:4px;margin:0">WELCOME200</p>
      <p style="color:rgba(255,255,255,0.8);font-size:12px;margin:6px 0 0">₹200 off on your first order</p>
    </div>
    <a href="${FRONTEND_URL}/home"
       style="display:block;text-align:center;background:linear-gradient(135deg,#9400D3,#ED80E9);color:#fff;padding:14px;border-radius:8px;text-decoration:none;font-weight:700;margin-top:20px">
      Start Shopping →
    </a>
    <p style="font-size:11px;color:#bbb;text-align:center;margin-top:24px">© 2025 TheZuro. All rights reserved.</p>
  </div>
`;

// ── OTP Email Template ──
const otpTemplate = (name, otp, purpose) => `
  <div style="font-family:sans-serif;max-width:500px;margin:auto;padding:32px;border:1px solid #eee;border-radius:12px">
    <h1 style="color:#9400D3;text-align:center">TheZuro 🛍</h1>
    <p>Hi <strong>${name}</strong>,</p>
    <p style="color:#555">Your OTP for <strong>${purpose}</strong>:</p>
    <div style="font-size:42px;font-weight:700;letter-spacing:12px;color:#9400D3;text-align:center;padding:28px;background:#f8f4ff;border-radius:12px;margin:24px 0">
      ${otp}
    </div>
    <p style="color:#999;font-size:13px;text-align:center">⏱ Expires in 5 minutes. 🔒 Do not share.</p>
    <p style="font-size:11px;color:#bbb;text-align:center;margin-top:24px">© 2025 TheZuro. All rights reserved.</p>
  </div>
`;

// ══════════════════════════════════════════════
// POST /api/auth/register
// ══════════════════════════════════════════════
router.post("/register", async (req, res) => {
  try {
    const { full_name, email, phone, password } = req.body;

    if (!full_name || !email || !phone || !password)
      return res.status(400).json({ success: false, message: "All fields are required" });

    // Check duplicate
    const exists = await pool.query(
      "SELECT id FROM users WHERE email=$1 OR phone=$2",
      [email, phone]
    );
    if (exists.rows.length > 0)
      return res.status(409).json({
        success: false,
        message: "Account already exists with this email or phone. Please login."
      });

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // ✅ Save user — directly verified
    const inserted = await pool.query(
      `INSERT INTO users
        (full_name, email, phone, password_hash, is_email_verified, is_phone_verified, role, role_id)
       VALUES ($1,$2,$3,$4, true, true, 'customer', 1)
       RETURNING id`,
      [full_name, email, phone, password_hash]
    );

    const user_id = inserted.rows[0].id;

    // ✅ Welcome email bhejo — fail hone pe bhi account banega
    await sendEmail(
      email,
      "Welcome to TheZuro! 🎉",
      welcomeTemplate(full_name, email)
    );

    // ✅ JWT token
    const token = jwt.sign(
      { id: user_id, email, role: "customer" },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Account created successfully!",
      token,
      user: { id: user_id, full_name, email, phone },
    });

  } catch (err) {
    console.error("[REGISTER ERROR]", err.message);
    res.status(500).json({ success: false, message: "Registration failed. Please try again." });
  }
});

// ══════════════════════════════════════════════
// POST /api/auth/login
// ══════════════════════════════════════════════
router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password)
      return res.status(400).json({ success: false, message: "All fields required" });

    const isEmail = identifier.includes("@");

    const result = await pool.query(
      isEmail
        ? "SELECT * FROM users WHERE email=$1 AND deleted_at IS NULL"
        : "SELECT * FROM users WHERE phone=$1 AND deleted_at IS NULL",
      [identifier]
    );

    if (result.rows.length === 0)
      return res.status(404).json({
        success: false,
        message: "No account found. Please register."
      });

    const u = result.rows[0];

    if (u.is_blocked)
      return res.status(403).json({
        success: false,
        message: "Account blocked. Contact support."
      });

    if (!u.is_phone_verified && !u.is_email_verified)
      return res.status(403).json({
        success: false,
        message: "Please verify your account first."
      });

    const match = await bcrypt.compare(password, u.password_hash);
    if (!match)
      return res.status(401).json({
        success: false,
        message: "Incorrect password. Please try again."
      });

    await pool.query(
      "UPDATE users SET last_login_at=NOW() WHERE id=$1",
      [u.id]
    );

    const token = jwt.sign(
      { id: u.id, email: u.email, role: u.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id:        u.id,
        full_name: u.full_name,
        email:     u.email,
        phone:     u.phone,
        role:      u.role,
      },
    });

  } catch (err) {
    console.error("[LOGIN ERROR]", err.message);
    res.status(500).json({ success: false, message: "Login failed." });
  }
});

// ══════════════════════════════════════════════
// POST /api/auth/forgot
// ══════════════════════════════════════════════
router.post("/forgot", async (req, res) => {
  try {
    const { identifier } = req.body;

    if (!identifier)
      return res.status(400).json({ success: false, message: "Email or phone required" });

    const isEmail = identifier.includes("@");

    const result = await pool.query(
      isEmail
        ? "SELECT * FROM users WHERE email=$1 AND deleted_at IS NULL"
        : "SELECT * FROM users WHERE phone=$1 AND deleted_at IS NULL",
      [identifier]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ success: false, message: "No account found." });

    const u = result.rows[0];

    if (isEmail) {
      const resetToken = jwt.sign(
        { id: u.id, email: u.email },
        JWT_SECRET,
        { expiresIn: "15m" }
      );

      const resetLink = `${FRONTEND_URL}/reset-password?token=${resetToken}`;

      await sendEmail(
        u.email,
        "TheZuro — Reset Your Password",
        `
        <div style="font-family:sans-serif;max-width:500px;margin:auto;padding:32px;border:1px solid #eee;border-radius:12px">
          <h1 style="color:#9400D3;text-align:center">TheZuro 🛍</h1>
          <h2>Reset Your Password 🔐</h2>
          <p>Hi <strong>${u.full_name}</strong>,</p>
          <p>Click below to reset your password. Expires in <strong>15 minutes</strong>.</p>
          <div style="text-align:center;margin:32px 0">
            <a href="${resetLink}"
               style="background:linear-gradient(135deg,#9400D3,#ED80E9);color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700">
              Reset Password →
            </a>
          </div>
          <p style="color:#999;font-size:12px">If you didn't request this, ignore this email.</p>
        </div>
        `
      );

      res.json({ success: true, message: "Reset link sent to your email." });

    } else {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      await pool.query(
        `INSERT INTO otp_tokens (user_id, identifier, otp_code, purpose, expires_at)
         VALUES ($1,$2,$3,'forgot', NOW() + INTERVAL '5 minutes')`,
        [u.id, identifier, otp]
      );

      await sendEmail(
        u.email,
        "TheZuro — Password Reset OTP",
        otpTemplate(u.full_name, otp, "password reset")
      );

      res.json({ success: true, message: "OTP sent to your email." });
    }

  } catch (err) {
    console.error("[FORGOT ERROR]", err.message);
    res.status(500).json({ success: false, message: "Failed. Try again." });
  }
});

// ══════════════════════════════════════════════
// POST /api/auth/resend-otp
// ══════════════════════════════════════════════
router.post("/resend-otp", async (req, res) => {
  try {
    const { phone, purpose } = req.body;

    if (!phone || !purpose)
      return res.status(400).json({ success: false, message: "Phone and purpose required" });

    const user = await pool.query(
      "SELECT * FROM users WHERE phone=$1 AND deleted_at IS NULL",
      [phone]
    );

    if (user.rows.length === 0)
      return res.status(404).json({ success: false, message: "User not found" });

    const u = user.rows[0];

    await pool.query(
      "UPDATE otp_tokens SET is_used=true WHERE identifier=$1 AND purpose=$2 AND is_used=false",
      [phone, purpose]
    );

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await pool.query(
      `INSERT INTO otp_tokens (user_id, identifier, otp_code, purpose, expires_at)
       VALUES ($1,$2,$3,$4, NOW() + INTERVAL '5 minutes')`,
      [u.id, phone, otp, purpose]
    );

    await sendEmail(
      u.email,
      "TheZuro — New OTP",
      otpTemplate(u.full_name, otp, purpose)
    );

    res.json({ success: true, message: "New OTP sent to your email." });

  } catch (err) {
    console.error("[RESEND OTP ERROR]", err.message);
    res.status(500).json({ success: false, message: "Failed to resend." });
  }
});

module.exports = router;