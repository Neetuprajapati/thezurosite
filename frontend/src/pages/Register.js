import React, { useState } from "react";
import theme from "./theme";

const API = "https://api.thezuro.com/api/auth";

const TOKEN = {
  black:    "#0a0a0a",
  white:    "#fafaf8",
  gold:     "#c9a84c",
  gray100:  "#f0ede8",
  gray200:  "#e0dbd2",
  gray400:  "#9b9690",
  gray600:  "#5a5650",
  red:      "#c0392b",
  green:    "#27ae60",
  fontDisplay: "'Playfair Display', Georgia, serif",
  fontBody:    "'DM Sans', 'Segoe UI', sans-serif",
};

const S = {
  page: { minHeight: "100vh", display: "flex", fontFamily: TOKEN.fontBody, background: TOKEN.white },
  left: { flex: 1, background: TOKEN.black, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "48px", position: "relative", overflow: "hidden" },
  leftGlow: { position: "absolute", inset: 0, background: "radial-gradient(ellipse at 20% 80%,rgba(201,168,76,.20) 0%,transparent 55%),radial-gradient(ellipse at 80% 20%,rgba(201,168,76,.10) 0%,transparent 50%)", pointerEvents: "none" },
  leftInner: { position: "relative", zIndex: 1 },
  logo: { fontFamily: TOKEN.fontDisplay, fontSize: "28px", fontWeight: 900, color: "#fff", textDecoration: "none", display: "block", marginBottom: "60px" },
  tagline: { fontFamily: TOKEN.fontDisplay, fontSize: "clamp(26px,3.2vw,46px)", fontWeight: 700, color: "#fff", lineHeight: 1.1, marginBottom: "14px" },
  taglineSub: { fontSize: "15px", color: "rgba(255,255,255,.5)", lineHeight: 1.65, maxWidth: "360px", marginBottom: "44px" },
  features: { display: "flex", flexDirection: "column", gap: "14px" },
  feat: { display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", color: "rgba(255,255,255,.7)" },
  featIcon: { width: "36px", height: "36px", borderRadius: "50%", background: "rgba(201,168,76,.15)", border: "1px solid rgba(201,168,76,.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 },
  leftFoot: { position: "relative", zIndex: 1, fontSize: "13px", color: "rgba(255,255,255,.25)" },
  right: { width: "540px", background: TOKEN.white, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px", overflowY: "auto" },
  box: { width: "100%", maxWidth: "420px" },
  tabs: { display: "flex", border: "1.5px solid #e0dbd2", borderRadius: "8px", overflow: "hidden", marginBottom: "32px" },
  tab: { flex: 1, padding: "12px", textAlign: "center", fontSize: "15px", fontWeight: 500, cursor: "pointer", border: "none", background: "transparent", color: TOKEN.gray400, fontFamily: TOKEN.fontBody },
  tabActive: { flex: 1, padding: "12px", textAlign: "center", fontSize: "15px", fontWeight: 600, cursor: "pointer", border: "none", background: TOKEN.black, color: "#fff", fontFamily: TOKEN.fontBody },
  title: { fontFamily: TOKEN.fontDisplay, fontSize: "26px", fontWeight: 700, marginBottom: "5px" },
  subtitle: { fontSize: "14px", color: TOKEN.gray400, marginBottom: "24px" },
  group: { marginBottom: "16px" },
  label: { display: "block", fontSize: "13px", fontWeight: 500, color: TOKEN.gray600, marginBottom: "6px" },
  req: { color: TOKEN.red, marginLeft: "2px" },
  input: { width: "100%", height: "48px", padding: "0 16px", border: "1.5px solid #e0dbd2", borderRadius: "8px", fontFamily: TOKEN.fontBody, fontSize: "14px", color: TOKEN.black, background: TOKEN.white, outline: "none", boxSizing: "border-box", transition: "border-color .2s, box-shadow .2s" },
  inputFocused: { borderColor: TOKEN.gold, boxShadow: "0 0 0 4px rgba(201,168,76,.12)" },
  inputError: { borderColor: TOKEN.red, boxShadow: "0 0 0 4px rgba(192,57,43,.1)" },
  hint: { fontSize: "12px", color: TOKEN.gray400, marginTop: "5px" },
  errMsg: { fontSize: "12px", color: TOKEN.red, marginTop: "5px" },
  inputWrap: { position: "relative" },
  eyeBtn: { position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "17px", color: TOKEN.gray400, padding: 0 },
  formRow2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" },
  phoneWrap: { display: "flex", border: "1.5px solid #e0dbd2", borderRadius: "8px", overflow: "hidden", transition: "border-color .2s, box-shadow .2s" },
  phoneFlag: { height: "48px", padding: "0 12px", background: TOKEN.gray100, border: "none", borderRight: "1.5px solid #e0dbd2", fontSize: "14px", fontFamily: TOKEN.fontBody, display: "flex", alignItems: "center", gap: "6px", flexShrink: 0, whiteSpace: "nowrap" },
  phoneNum: { flex: 1, height: "48px", padding: "0 14px", border: "none", fontFamily: TOKEN.fontBody, fontSize: "14px", outline: "none", background: "transparent", color: TOKEN.black },
  strengthBar: { display: "flex", gap: "4px", marginTop: "8px" },
  strengthSeg: (active, color) => ({ flex: 1, height: "3px", borderRadius: "2px", background: active ? color : TOKEN.gray200, transition: "background .3s" }),
  strengthLabel: (color) => ({ fontSize: "11px", color, marginTop: "3px", fontWeight: 500 }),
  termsRow: { display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "20px" },
  termsLabel: { fontSize: "13px", color: TOKEN.gray600, lineHeight: 1.5 },
  termsLink: { color: TOKEN.gold, textDecoration: "none" },
  submitBtn: { width: "100%", height: "52px", background: TOKEN.black, color: "#fff", border: "none", borderRadius: "8px", fontFamily: TOKEN.fontBody, fontSize: "15px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "all .25s" },
  divider: { display: "flex", alignItems: "center", gap: "12px", color: TOKEN.gray400, fontSize: "13px", margin: "20px 0" },
  divLine: { flex: 1, height: "1px", background: TOKEN.gray200 },
  social: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
  socialBtn: { height: "48px", border: "1.5px solid #e0dbd2", borderRadius: "8px", background: "#fff", cursor: "pointer", fontFamily: TOKEN.fontBody, fontSize: "14px", fontWeight: 500, color: TOKEN.black, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" },
  footerTxt: { textAlign: "center", marginTop: "20px", fontSize: "14px", color: TOKEN.gray400 },
  footerLink: { color: TOKEN.gold, textDecoration: "none", fontWeight: 500 },
  successWrap: { textAlign: "center", padding: "32px 0" },
  successIcon: { fontSize: "72px", marginBottom: "18px" },
  successTitle: { fontFamily: TOKEN.fontDisplay, fontSize: "26px", fontWeight: 700, marginBottom: "10px" },
  successDesc: { fontSize: "15px", color: TOKEN.gray400, marginBottom: "8px" },
  successEmail: { fontSize: "13px", color: TOKEN.gray400, marginBottom: "28px" },
  successBtn: { display: "inline-flex", alignItems: "center", gap: "8px", padding: "14px 40px", background: TOKEN.black, color: "#fff", borderRadius: "100px", textDecoration: "none", fontFamily: TOKEN.fontBody, fontSize: "15px", fontWeight: 600 },
  alert: (type) => ({ padding: "12px 14px", borderRadius: "8px", fontSize: "13px", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px", background: type === "error" ? "#fee2e2" : "#dcfce7", color: type === "error" ? "#991b1b" : "#166534", border: `1px solid ${type === "error" ? "#fca5a5" : "#86efac"}` }),
};

function getStrength(pw) {
  if (!pw) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { label: "", color: "" },
    { label: "Weak",   color: "#c0392b" },
    { label: "Fair",   color: "#e67e22" },
    { label: "Good",   color: "#f39c12" },
    { label: "Strong", color: "#27ae60" },
  ];
  return { score, ...map[score] };
}

function FInput({ label, required, type = "text", placeholder, value, onChange, hint, error, rightSlot, autoComplete }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={S.group}>
      {label && <label style={S.label}>{label}{required && <span style={S.req}>*</span>}</label>}
      <div style={S.inputWrap}>
        <input
          type={type} placeholder={placeholder} value={value}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ ...S.input, paddingRight: rightSlot ? "48px" : "16px", ...(error ? S.inputError : focused ? S.inputFocused : {}) }}
        />
        {rightSlot}
      </div>
      {hint && !error && <p style={S.hint}>{hint}</p>}
      {error && <p style={S.errMsg}>⚠ {error}</p>}
    </div>
  );
}

function PhoneInput({ value, onChange, error }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={S.group}>
      <label style={S.label}>Phone Number<span style={S.req}>*</span></label>
      <div style={{ ...S.phoneWrap, ...(error ? { borderColor: TOKEN.red } : focused ? { borderColor: TOKEN.gold, boxShadow: "0 0 0 4px rgba(201,168,76,.12)" } : {}) }}>
        <div style={S.phoneFlag}>🇮🇳 +91</div>
        <input
          type="tel" placeholder="98765 43210" value={value} maxLength={10}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 10))}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={S.phoneNum}
        />
      </div>
      {error && <p style={S.errMsg}>⚠ {error}</p>}
    </div>
  );
}

export default function Register() {
  const [step,      setStep]      = useState(1); // 1=form, 2=success
  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [email,     setEmail]     = useState("");
  const [phone,     setPhone]     = useState("");
  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [terms,     setTerms]     = useState(false);
  const [showPw,    setShowPw]    = useState(false);
  const [showCpw,   setShowCpw]   = useState(false);
  const [errors,    setErrors]    = useState({});
  const [loading,   setLoading]   = useState(false);
  const [alert,     setAlert]     = useState(null);

  const strength = getStrength(password);
  

  const validate = () => {
    const e = {};
    if (!firstName.trim()) e.firstName = "First name is required";
    if (!lastName.trim())  e.lastName  = "Last name is required";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Valid email is required";
    if (phone.length !== 10) e.phone = "Enter valid 10-digit phone number";
    if (password.length < 8) e.password = "Password must be at least 8 characters";
    if (password !== confirm) e.confirm = "Passwords do not match";
    if (!terms) e.terms = "Please accept the terms to continue";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Register → Direct account creation ──
  const handleRegister = async () => {
    setAlert(null);
    if (!validate()) return;
    setLoading(true);
    try {
      const res  = await fetch(`${API}/register`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          full_name: `${firstName.trim()} ${lastName.trim()}`,
          email:     email.trim(),
          phone:     phone.trim(),
          password,
        }),
      });
      const data = await res.json();
      if (data.success) {
        // ✅ Save token and user
        localStorage.setItem("token", data.token);
        localStorage.setItem("user",  JSON.stringify(data.user));
        // ✅ Show success screen
        setStep(2);
      } else {
        setAlert({ type: "error", msg: data.message });
      }
    } catch {
      setAlert({ type: "error", msg: "Cannot connect to server. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={S.page}>

      {/* Left Panel */}
      <div style={S.left}>
        <div style={S.leftGlow} />
        <div style={S.leftInner}>
          <a href="/" style={S.logo}>The<span style={{ color: TOKEN.gold }}>Zuro</span></a>
          <div>
            <h2 style={S.tagline}>
              Join <span style={{ color: TOKEN.gold }}>TheZuro</span> — Shop Smarter
            </h2>
            <p style={S.taglineSub}>
              Start your journey with India's fastest-growing marketplace. Sign up free in 2 minutes.
            </p>
            <div style={S.features}>
              {[
                ["🎁", "₹200 welcome coupon on your first order"],
                ["🛍", "Access to 50,000+ products"],
                ["⚡", "Flash sale early access for members"],
                ["🔒", "Secure checkout & data protection"],
              ].map(([icon, text]) => (
                <div key={text} style={S.feat}>
                  <div style={S.featIcon}>{icon}</div>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={S.leftFoot}>© 2025 TheZuro. All rights reserved.</div>
      </div>

      {/* Right Panel */}
      <div style={S.right}>
        <div style={S.box}>

          {/* ── STEP 1: Registration Form ── */}
          {step === 1 && <>

            <div style={S.tabs}>
              <button style={S.tab} onClick={() => window.location.href = "/login"}>Sign In</button>
              <button style={S.tabActive}>Create Account</button>
            </div>

            <h1 style={S.title}>Create Account ✨</h1>
            <p style={S.subtitle}>Join TheZuro — it's free forever</p>

            {alert && (
              <div style={S.alert(alert.type)}>
                {alert.type === "error" ? "⚠️" : "✅"} {alert.msg}
              </div>
            )}

            <div style={S.formRow2}>
              <FInput label="First Name" required placeholder="Rahul"  value={firstName} onChange={setFirstName} error={errors.firstName} />
              <FInput label="Last Name"  required placeholder="Verma"  value={lastName}  onChange={setLastName}  error={errors.lastName} />
            </div>

            <FInput
              label="Email Address" required type="email"
              placeholder="you@example.com"
              value={email} onChange={setEmail}
              error={errors.email} autoComplete="email"
            />

            <PhoneInput value={phone} onChange={setPhone} error={errors.phone} />

            <FInput
              label="Password" required
              type={showPw ? "text" : "password"}
              placeholder="Create a strong password"
              value={password} onChange={setPassword}
              error={errors.password}
              hint={!errors.password ? "Min 8 chars, include a number & symbol" : undefined}
              autoComplete="new-password"
              rightSlot={
                <button style={S.eyeBtn} type="button" onClick={() => setShowPw(!showPw)}>
                  {showPw ? "🙈" : "👁"}
                </button>
              }
            />

            {password && (
              <div style={{ marginTop: "-10px", marginBottom: "14px" }}>
                <div style={S.strengthBar}>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} style={S.strengthSeg(i <= strength.score, strength.color)} />
                  ))}
                </div>
                {strength.label && <div style={S.strengthLabel(strength.color)}>{strength.label} password</div>}
              </div>
            )}

            <FInput
              label="Confirm Password" required
              type={showCpw ? "text" : "password"}
              placeholder="Repeat your password"
              value={confirm} onChange={setConfirm}
              error={errors.confirm} autoComplete="new-password"
              rightSlot={
                <button style={S.eyeBtn} type="button" onClick={() => setShowCpw(!showCpw)}>
                  {showCpw ? "🙈" : "👁"}
                </button>
              }
            />

            <div style={S.termsRow}>
              <input
                type="checkbox" id="terms" checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
                style={{ accentColor: TOKEN.gold, width: "16px", height: "16px", marginTop: "2px", flexShrink: 0 }}
              />
              <label htmlFor="terms" style={S.termsLabel}>
                I agree to the <a href="/terms" style={S.termsLink}>Terms of Service</a> and <a href="/privacy" style={S.termsLink}>Privacy Policy</a>
                {errors.terms && <span style={{ color: TOKEN.red, display: "block", marginTop: "3px" }}>⚠ {errors.terms}</span>}
              </label>
            </div>

            <button
              style={{ ...S.submitBtn, opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? "⏳ Creating account…" : "Create Account →"}
            </button>

            <div style={S.divider}>
              <div style={S.divLine} /> or sign up with <div style={S.divLine} />
            </div>
            <div style={S.social}>
              <button style={S.socialBtn}><span style={{ fontSize: "18px" }}>G</span> Google</button>
              <button style={S.socialBtn}><span style={{ fontSize: "18px" }}>📘</span> Facebook</button>
            </div>
            <p style={S.footerTxt}>
              Already have an account? <a href="/login" style={S.footerLink}>Sign in</a>
            </p>
          </>}

          {/* ── STEP 2: Success Screen ── */}
          {step === 2 && (
            <div style={S.successWrap}>
              <div style={S.successIcon}>🎉</div>
              <h2 style={S.successTitle}>Account Created!</h2>
              <p style={S.successDesc}>
                Welcome to TheZuro, <strong>{firstName}</strong>!<br />
                Your account has been successfully created.
              </p>
              <p style={S.successEmail}>
                📧 A welcome email has been sent to<br />
                <strong>{email}</strong>
              </p>

              {/* Welcome coupon box */}
              <div style={{
                background: "linear-gradient(135deg,#9400D3,#ED80E9)",
                borderRadius: "12px", padding: "16px", marginBottom: "28px",
              }}>
                <p style={{ color: "#fff", fontSize: "13px", margin: "0 0 6px" }}>🎁 Your Welcome Gift</p>
                <p style={{ color: "#fff", fontSize: "24px", fontWeight: 700, letterSpacing: "4px", margin: 0 }}>WELCOME200</p>
                <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px", margin: "6px 0 0" }}>₹200 off on your first order</p>
              </div>

              <a href="/home" style={S.successBtn}>Start Shopping →</a>

              <p style={{ fontSize: "13px", color: TOKEN.gray400, marginTop: "16px" }}>
                <a href="/login" style={{ color: TOKEN.gold, fontWeight: 500 }}>
                  Already have the app? Sign in →
                </a>
              </p>
            </div>
          )}

        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        @media (max-width: 900px) {
          div[style*="flex: 1"][style*="background: rgb(10, 10, 10)"] { display: none !important; }
          div[style*="width: 540px"] { width: 100% !important; }
        }
        button { transition: opacity .2s; }
        button:hover { opacity: 0.88; }
        input[type="checkbox"] { cursor: pointer; }
      `}</style>
    </div>
  );
}