const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/brevoEmail");
const { generateOTP } = require("../utils/otp");

// ─────────────────────────────────────────────────────────────
//  EMAIL TEMPLATES
// ─────────────────────────────────────────────────────────────

const welcomeEmailTemplate = (full_name) => ({
  subject: "Welcome to TheZuro – Your Shopping Journey Begins! 🎉",
  html: `
  <!DOCTYPE html>
  <html lang="en">
  <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
  <body style="margin:0;padding:0;background-color:#f4f0fb;font-family:'Segoe UI',Arial,sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f0fb;padding:40px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(148,0,211,0.10);">

            <!-- HEADER -->
            <tr>
              <td style="background:linear-gradient(135deg,rgb(148,0,211),rgb(237,128,233));padding:40px 40px 30px;text-align:center;">
                <h1 style="margin:0;font-size:32px;font-weight:800;color:#ffffff;letter-spacing:1px;">TheZuro</h1>
                <p style="margin:8px 0 0;font-size:14px;color:rgba(255,255,255,0.85);">India's Fastest Growing Shopping Platform 🚀</p>
              </td>
            </tr>

            <!-- BODY -->
            <tr>
              <td style="padding:40px 40px 30px;">
                <h2 style="margin:0 0 12px;font-size:24px;color:#2d0045;font-weight:700;">Welcome aboard, ${full_name}! 👋</h2>
                <p style="margin:0 0 20px;font-size:15px;color:#555;line-height:1.7;">
                  We're thrilled to have you join the <strong>TheZuro</strong> family. Your account has been created successfully and you're all set to explore thousands of products at the best prices.
                </p>

                <!-- FEATURE HIGHLIGHTS -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                  <tr>
                    <td style="background:#f9f4ff;border-radius:12px;padding:20px 24px;">
                      <p style="margin:0 0 12px;font-size:14px;font-weight:700;color:#7b00cc;text-transform:uppercase;letter-spacing:0.5px;">What you can do now</p>
                      <table cellpadding="0" cellspacing="0">
                        <tr><td style="padding:4px 0;font-size:14px;color:#444;">🛍️ &nbsp; Browse & shop from 10,000+ products</td></tr>
                        <tr><td style="padding:4px 0;font-size:14px;color:#444;">⚡ &nbsp; Get exclusive member-only deals</td></tr>
                        <tr><td style="padding:4px 0;font-size:14px;color:#444;">📦 &nbsp; Track your orders in real time</td></tr>
                        <tr><td style="padding:4px 0;font-size:14px;color:#444;">💳 &nbsp; Enjoy fast & secure checkout</td></tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <!-- CTA BUTTON -->
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center">
                      <a href="https://thezuro.com/home"
                         style="display:inline-block;padding:14px 40px;background:linear-gradient(135deg,rgb(148,0,211),rgb(237,128,233));color:#ffffff;text-decoration:none;border-radius:8px;font-size:15px;font-weight:700;letter-spacing:0.3px;">
                        Start Shopping Now →
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- DIVIDER -->
            <tr>
              <td style="padding:0 40px;">
                <hr style="border:none;border-top:1px solid #ede0fa;margin:0;">
              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td style="padding:24px 40px;text-align:center;">
                <p style="margin:0 0 6px;font-size:13px;color:#999;">Need help? Reach us at <a href="mailto:support@thezuro.com" style="color:rgb(148,0,211);text-decoration:none;">support@thezuro.com</a></p>
                <p style="margin:0;font-size:12px;color:#bbb;">© ${new Date().getFullYear()} TheZuro. All rights reserved.</p>
                <p style="margin:8px 0 0;font-size:12px;color:#ccc;">You're receiving this email because you registered on TheZuro.</p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>

  </body>
  </html>
  `,
});

const otpEmailTemplate = (otp) => ({
  subject: "Your TheZuro Login OTP – Valid for 5 Minutes",
  html: `
  <!DOCTYPE html>
  <html lang="en">
  <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
  <body style="margin:0;padding:0;background-color:#f4f0fb;font-family:'Segoe UI',Arial,sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f0fb;padding:40px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(148,0,211,0.10);">

            <!-- HEADER -->
            <tr>
              <td style="background:linear-gradient(135deg,rgb(148,0,211),rgb(237,128,233));padding:36px 40px;text-align:center;">
                <h1 style="margin:0;font-size:28px;font-weight:800;color:#ffffff;">TheZuro</h1>
                <p style="margin:6px 0 0;font-size:14px;color:rgba(255,255,255,0.85);">Secure Login Verification</p>
              </td>
            </tr>

            <!-- BODY -->
            <tr>
              <td style="padding:40px 40px 20px;">
                <h2 style="margin:0 0 10px;font-size:22px;color:#2d0045;font-weight:700;">Your One-Time Password</h2>
                <p style="margin:0 0 28px;font-size:15px;color:#555;line-height:1.7;">
                  Use the OTP below to complete your login. This code is valid for <strong>5 minutes</strong> and can only be used once.
                </p>

                <!-- OTP BOX -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                  <tr>
                    <td align="center" style="background:#f9f4ff;border:2px dashed rgb(200,100,240);border-radius:12px;padding:28px;">
                      <p style="margin:0 0 6px;font-size:12px;font-weight:600;color:#9b59b6;letter-spacing:1px;text-transform:uppercase;">Your OTP Code</p>
                      <p style="margin:0;font-size:42px;font-weight:800;letter-spacing:10px;color:rgb(148,0,211);">${otp}</p>
                    </td>
                  </tr>
                </table>

                <!-- WARNING -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                  <tr>
                    <td style="background:#fff8e1;border-left:4px solid #f5a623;border-radius:6px;padding:14px 18px;">
                      <p style="margin:0;font-size:13px;color:#7a5800;">
                        ⚠️ <strong>Security Notice:</strong> Never share this OTP with anyone. TheZuro will never ask for your OTP via call or chat.
                      </p>
                    </td>
                  </tr>
                </table>

                <p style="margin:0;font-size:14px;color:#888;line-height:1.6;">
                  If you did not request this OTP, please ignore this email. Your account remains secure.
                </p>
              </td>
            </tr>

            <!-- DIVIDER -->
            <tr>
              <td style="padding:0 40px;">
                <hr style="border:none;border-top:1px solid #ede0fa;margin:0;">
              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td style="padding:24px 40px;text-align:center;">
                <p style="margin:0 0 6px;font-size:13px;color:#999;">Need help? Contact us at <a href="mailto:support@thezuro.com" style="color:rgb(148,0,211);text-decoration:none;">support@thezuro.com</a></p>
                <p style="margin:0;font-size:12px;color:#bbb;">© ${new Date().getFullYear()} TheZuro. All rights reserved.</p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>

  </body>
  </html>
  `,
});

// ─────────────────────────────────────────────────────────────
//  CONTROLLERS
// ─────────────────────────────────────────────────────────────

// ✅ REGISTER
exports.register = async (req, res) => {
  try {
    const { full_name, email, phone, password } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users(full_name,email,phone,password_hash) VALUES($1,$2,$3,$4) RETURNING id, full_name, email, phone",
      [full_name, email, phone, hash]
    );

    const user = result.rows[0];

    // ✅ Send professional welcome email
    const { subject, html } = welcomeEmailTemplate(full_name);
    await sendEmail(email, subject, html);

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    res.json({ success: true, token, user });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Registration failed." });
  }
};

// ✅ LOGIN (Password)
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const result = await pool.query(
      `SELECT * FROM users WHERE email=$1 OR phone=$1`,
      [identifier]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ success: false, message: "No account found with this email or phone. Please register first." });

    const user = result.rows[0];

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match)
      return res.status(401).json({ success: false, message: "Incorrect password. Please try again." });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    const { password_hash, ...safeUser } = user;

    res.json({ success: true, token, user: safeUser });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Login failed. Please try again." });
  }
};

// ✅ SEND LOGIN OTP
exports.sendLoginOtp = async (req, res) => {
  try {
    const { identifier } = req.body;

    if (!identifier) {
      return res.status(400).json({ success: false, message: "Email or phone number is required." });
    }

    // Check if user is registered
    const userResult = await pool.query(
      `SELECT * FROM users WHERE email=$1 OR phone=$1`,
      [identifier]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email or phone. Please register first.",
      });
    }

    const user = userResult.rows[0];

    const otp = generateOTP();
    const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await pool.query(
      `INSERT INTO otp_tokens (identifier, otp_code, purpose, expires_at)
       VALUES ($1, $2, 'login', $3)`,
      [identifier, otp, expires]
    );

    // ✅ Send professional OTP email
    if (user.email) {
      const { subject, html } = otpEmailTemplate(otp);
      await sendEmail(user.email, subject, html);
    }

    res.json({ success: true, message: "OTP sent successfully." });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Failed to send OTP. Please try again." });
  }
};

// ✅ VERIFY LOGIN OTP
exports.verifyLoginOtp = async (req, res) => {
  try {
    const { identifier, otp } = req.body;

    if (!identifier || !otp) {
      return res.status(400).json({ success: false, message: "Email/phone and OTP are both required." });
    }

    const result = await pool.query(
      `SELECT * FROM otp_tokens 
       WHERE identifier=$1 AND otp_code=$2 AND purpose='login'
       AND is_used=false AND expires_at > NOW()
       ORDER BY created_at DESC LIMIT 1`,
      [identifier, otp]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP. Please request a new one." });
    }

    const otpRow = result.rows[0];

    await pool.query("UPDATE otp_tokens SET is_used=true WHERE id=$1", [otpRow.id]);

    const userResult = await pool.query(
      `SELECT * FROM users WHERE email=$1 OR phone=$1`,
      [identifier]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const user = userResult.rows[0];
    const { password_hash, ...safeUser } = user;

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    res.json({ success: true, token, user: safeUser });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "OTP verification failed. Please try again." });
  }
};

// ✅ FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    await sendEmail(email, "Reset Password – TheZuro", "<h2>Password reset link will be here.</h2>");
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

// ✅ RESEND OTP
exports.resendOtp = async (req, res) => {
  try {
    res.json({ success: true, message: "OTP resent successfully." });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};
