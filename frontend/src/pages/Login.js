import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ForgotPasswordPopup from "./ForgotPasswordPopup";

const API = "http://localhost:5000/api/auth";

// ── Gold color tokens ────────────────────────────────────────
const GOLD       = "#C9A84C";
const GOLD_LIGHT = "#F0D080";
const GOLD_DARK  = "#8B6914";
const BLACK      = "#0A0A0A";
const DARK       = "#111111";
const DARK2      = "#1A1A1A";

const goldGrad = `linear-gradient(135deg, ${GOLD_DARK}, ${GOLD}, ${GOLD_LIGHT}, ${GOLD})`;

// ── TheZuro SVG Logo (matches brand image) ───────────────────
const TheZuroLogo = ({ size = 90 }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="goldG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor={GOLD_DARK} />
          <stop offset="40%"  stopColor={GOLD} />
          <stop offset="70%"  stopColor={GOLD_LIGHT} />
          <stop offset="100%" stopColor={GOLD} />
        </linearGradient>
      </defs>
      {/* T */}
      <line x1="22" y1="18" x2="52" y2="18" stroke="url(#goldG)" strokeWidth="5.5" strokeLinecap="round"/>
      <line x1="37" y1="18" x2="37" y2="58" stroke="url(#goldG)" strokeWidth="5.5" strokeLinecap="round"/>
      {/* Z overlapping */}
      <polyline points="46,28 80,28 50,72 84,72" stroke="url(#goldG)" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>

    {/* "TheZuro" wordmark with decorative lines */}
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 22, height: 1, background: goldGrad }} />
      <span style={{
        fontSize: 15, fontWeight: 700, letterSpacing: 4,
        background: goldGrad,
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        fontFamily: "'Georgia', 'Times New Roman', serif",
        textTransform: "uppercase",
      }}>
        TheZuro
      </span>
      <div style={{ width: 22, height: 1, background: goldGrad }} />
    </div>
  </div>
);

// ── Input style ──────────────────────────────────────────────
const inputStyle = (focused) => ({
  width: "100%",
  height: "48px",
  padding: "0 16px",
  border: `1.5px solid ${focused ? GOLD : "#333"}`,
  borderRadius: "8px",
  outline: "none",
  background: focused ? "#1C1600" : "#161616",
  marginBottom: "14px",
  fontSize: "14px",
  fontFamily: "inherit",
  boxSizing: "border-box",
  color: "#fff",
  transition: "border-color 0.2s, background 0.2s",
});

// ── OTP Popup ────────────────────────────────────────────────
function OtpLoginPopup({ onClose, onSuccess }) {
  const [step, setStep]           = useState("enter_email");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp]             = useState("");
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [focusId, setFocusId]     = useState(false);
  const [focusOtp, setFocusOtp]   = useState(false);

  const handleSendOtp = async () => {
    setError("");
    if (!identifier.trim()) { setError("Email or phone number is required."); return; }
    setLoading(true);
    try {
      const res  = await fetch(`${API}/send-login-otp`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ identifier: identifier.trim() }) });
      const data = await res.json();
      if (data.success) { setStep("enter_otp"); setError(""); }
      else setError(data.message || "Failed to send OTP.");
    } catch { setError("Unable to connect to server."); }
    finally { setLoading(false); }
  };

  const handleVerifyOtp = async () => {
    setError("");
    if (!otp.trim()) { setError("Please enter the OTP."); return; }
    setLoading(true);
    try {
      const res  = await fetch(`${API}/verify-login-otp`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ identifier: identifier.trim(), otp: otp.trim() }) });
      const data = await res.json();
      if (data.success) { localStorage.setItem("token", data.token); localStorage.setItem("user", JSON.stringify(data.user)); onSuccess(); }
      else setError(data.message || "Invalid or expired OTP.");
    } catch { setError("OTP verification failed."); }
    finally { setLoading(false); }
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)", zIndex: 999 }} />
      <div style={{
        position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        background: DARK2, borderRadius: "16px", padding: "32px 28px",
        width: "90%", maxWidth: "380px", zIndex: 1000,
        boxShadow: `0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px ${GOLD}44`,
        boxSizing: "border-box",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 700, background: goldGrad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {step === "enter_email" ? "Login with OTP 🔐" : "Enter Your OTP ✉️"}
          </h2>
          <span onClick={onClose} style={{ cursor: "pointer", fontSize: "18px", color: "#666" }}>✕</span>
        </div>

        {error && (
          <div style={{ color: "#fca5a5", marginBottom: "12px", fontSize: "13px", background: "#2d0000", padding: "10px 12px", borderRadius: "8px", border: "1px solid #7f1d1d" }}>
            {error}
          </div>
        )}

        {step === "enter_email" && (
          <>
            <p style={{ fontSize: "13px", color: "#888", marginBottom: "16px" }}>
              Enter your registered email or phone.{" "}
              <a href="/register" style={{ color: GOLD, fontWeight: 600, textDecoration: "none" }}>Register here</a>
            </p>
            <input style={inputStyle(focusId)} placeholder="Email or Phone Number" value={identifier}
              onChange={e => setIdentifier(e.target.value)} onFocus={() => setFocusId(true)} onBlur={() => setFocusId(false)}
              onKeyDown={e => e.key === "Enter" && handleSendOtp()} autoComplete="username" />
            <button onClick={handleSendOtp} disabled={loading} style={btnStyle(loading)}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        )}

        {step === "enter_otp" && (
          <>
            <p style={{ fontSize: "13px", color: "#888", marginBottom: "16px" }}>
              OTP sent to <strong style={{ color: GOLD }}>{identifier}</strong>. Check your inbox.
            </p>
            <input style={inputStyle(focusOtp)} placeholder="Enter 6-digit OTP" value={otp}
              onChange={e => setOtp(e.target.value)} onFocus={() => setFocusOtp(true)} onBlur={() => setFocusOtp(false)}
              onKeyDown={e => e.key === "Enter" && handleVerifyOtp()} maxLength={6} inputMode="numeric" autoComplete="one-time-code" />
            <button onClick={handleVerifyOtp} disabled={loading} style={{ ...btnStyle(loading), marginBottom: "12px" }}>
              {loading ? "Verifying..." : "Verify & Login"}
            </button>
            <p onClick={() => { setOtp(""); setError(""); setStep("enter_email"); }}
              style={{ textAlign: "center", fontSize: "13px", color: GOLD, cursor: "pointer", fontWeight: 500 }}>
              Didn't receive the OTP? Resend
            </p>
          </>
        )}
      </div>
    </>
  );
}

// ── Gold button style ────────────────────────────────────────
const btnStyle = (loading) => ({
  width: "100%", height: "48px",
  background: loading ? "#333" : goldGrad,
  color: loading ? "#888" : BLACK,
  border: "none", borderRadius: "8px",
  cursor: loading ? "not-allowed" : "pointer",
  fontSize: "15px", fontWeight: 700,
  letterSpacing: "0.5px",
  boxShadow: loading ? "none" : `0 4px 20px ${GOLD}44`,
  transition: "opacity 0.2s, transform 0.1s",
  fontFamily: "inherit",
});

// ── Main Login ───────────────────────────────────────────────
export default function Login() {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword]     = useState("");
  const [showPw, setShowPw]         = useState(false);
  const [error, setError]           = useState("");
  const [loading, setLoading]       = useState(false);
  const [focusId, setFocusId]       = useState(false);
  const [focusPw, setFocusPw]       = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [showOtp, setShowOtp]       = useState(false);

  const handleLogin = async () => {
    setError("");
    if (!identifier.trim()) { setError("Email or phone number is required."); return; }
    if (!password.trim())   { setError("Password is required."); return; }
    setLoading(true);
    try {
      const res  = await fetch(`${API}/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ identifier: identifier.trim(), password }) });
      const data = await res.json();
      if (data.success) { localStorage.setItem("token", data.token); localStorage.setItem("user", JSON.stringify(data.user)); navigate("/home"); }
      else setError(data.message);
    } catch { setError("Unable to connect to the server. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ display: "flex", minHeight: "100dvh", fontFamily: "'Georgia', 'Times New Roman', serif", background: BLACK }}>

      {/* ── LEFT PANEL ── */}
      <div style={{
        display: "none",
        flex: 1,
        background: BLACK,
        borderRight: `1px solid ${GOLD}33`,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px",
        position: "relative",
        overflow: "hidden",
      }} className="left-panel">

        {/* Decorative corner lines */}
        <div style={{ position: "absolute", top: 32, left: 32, width: 60, height: 60, borderTop: `2px solid ${GOLD}66`, borderLeft: `2px solid ${GOLD}66` }} />
        <div style={{ position: "absolute", bottom: 32, right: 32, width: 60, height: 60, borderBottom: `2px solid ${GOLD}66`, borderRight: `2px solid ${GOLD}66` }} />

        {/* Glowing orb */}
        <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, ${GOLD}18 0%, transparent 70%)`, top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />

        <TheZuroLogo size={110} />

        <div style={{ marginTop: 40, textAlign: "center" }}>
          <p style={{ fontSize: 13, color: "#666", letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>
            India's Premium Fashion House
          </p>
          <div style={{ width: 60, height: 1, background: goldGrad, margin: "0 auto 20px" }} />
          <p style={{ fontSize: 13, color: "#555", lineHeight: 1.8, maxWidth: 260, fontFamily: "sans-serif" }}>
            Curated fashion, exclusive brands, and luxury delivered to your doorstep.
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        background: `radial-gradient(ellipse at 70% 30%, ${GOLD}0D 0%, transparent 60%), ${BLACK}`,
      }}>
        <div style={{ width: "100%", maxWidth: 400 }}>

          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <TheZuroLogo size={80} />
          </div>

          {/* Card */}
          <div style={{
            background: DARK2,
            borderRadius: 16,
            padding: "36px 32px",
            border: `1px solid ${GOLD}33`,
            boxShadow: `0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px ${GOLD}11`,
          }}>

            <h2 style={{
              fontSize: 20, fontWeight: 700, textAlign: "center",
              marginBottom: 28, letterSpacing: 1,
              background: goldGrad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              Welcome Back
            </h2>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <div style={{ flex: 1, height: 1, background: "#222" }} />
              <span style={{ fontSize: 11, color: "#555", letterSpacing: 2, textTransform: "uppercase", fontFamily: "sans-serif" }}>Sign In</span>
              <div style={{ flex: 1, height: 1, background: "#222" }} />
            </div>

            {error && (
              <div style={{ color: "#fca5a5", marginBottom: 14, fontSize: 13, background: "#2d0000", padding: "10px 14px", borderRadius: 8, border: "1px solid #7f1d1d", fontFamily: "sans-serif" }}>
                {error}
              </div>
            )}

            {/* Identifier */}
            <input
              style={inputStyle(focusId)}
              placeholder="Email or Phone Number"
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              onFocus={() => setFocusId(true)}
              onBlur={() => setFocusId(false)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              autoComplete="username"
            />

            {/* Password */}
            <div style={{ position: "relative" }}>
              <input
                style={inputStyle(focusPw)}
                type={showPw ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocusPw(true)}
                onBlur={() => setFocusPw(false)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                autoComplete="current-password"
              />
              <span onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 14, top: 14, cursor: "pointer", fontSize: 15, color: "#666" }}>
                {showPw ? "🙈" : "👁"}
              </span>
            </div>

            {/* Forgot */}
            <div style={{ textAlign: "right", marginTop: -6, marginBottom: 22 }}>
              <span onClick={() => setShowForgot(true)} style={{ fontSize: 12, color: GOLD, cursor: "pointer", fontFamily: "sans-serif", letterSpacing: 0.3 }}>
                Forgot Password?
              </span>
            </div>

            {/* Buttons */}
            <button
              onClick={handleLogin}
              disabled={loading}
              style={{ ...btnStyle(loading), marginBottom: 10 }}
              onMouseEnter={e => { if (!loading) e.target.style.opacity = 0.88; }}
              onMouseLeave={e => { e.target.style.opacity = 1; }}
            >
              {loading ? "Signing in..." : "Login"}
            </button>

            <button
              onClick={() => setShowOtp(true)}
              style={{
                width: "100%", height: 46,
                background: "transparent",
                border: `1.5px solid ${GOLD}`,
                color: GOLD, borderRadius: 8,
                cursor: "pointer", fontSize: 14, fontWeight: 600,
                letterSpacing: 0.5, fontFamily: "inherit",
                transition: "background 0.2s",
              }}
              onMouseEnter={e => e.target.style.background = `${GOLD}18`}
              onMouseLeave={e => e.target.style.background = "transparent"}
            >
              Login with OTP
            </button>

            {/* Register */}
            <p style={{ textAlign: "center", marginTop: 24, fontSize: 13, color: "#555", fontFamily: "sans-serif" }}>
              Don't have an account?{" "}
              <span onClick={() => navigate("/register")} style={{ color: GOLD, fontWeight: 600, cursor: "pointer" }}>
                Register
              </span>
            </p>
          </div>

          {/* Bottom tagline */}
          <p style={{ textAlign: "center", marginTop: 20, fontSize: 11, color: "#444", letterSpacing: 2, textTransform: "uppercase", fontFamily: "sans-serif" }}>
            India's Fastest Growing Fashion Platform
          </p>
        </div>
      </div>

      {/* Popups */}
      {showForgot && <ForgotPasswordPopup onClose={() => setShowForgot(false)} />}
      {showOtp    && <OtpLoginPopup onClose={() => setShowOtp(false)} onSuccess={() => navigate("/home")} />}

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { width: 100%; height: 100%; overflow-x: hidden; background: ${BLACK}; }
        input::placeholder { color: #555; }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 100px #161616 inset !important;
          -webkit-text-fill-color: #fff !important;
        }
        @media (min-width: 768px) {
          .left-panel { display: flex !important; }
        }
      `}</style>
    </div>
  );
}