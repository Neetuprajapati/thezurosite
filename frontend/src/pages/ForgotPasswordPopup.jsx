import { useState } from "react";
import theme from "./theme";


const API = "http://localhost:5000/api/auth";
const G   = "linear-gradient(135deg, rgb(148,0,211), rgb(237,128,233))";
const gradText = {
  background: G,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

const isEmail = (v) => /\S+@\S+\.\S+/.test(v);
const isPhone = (v) => /^[6-9]\d{9}$/.test(v.replace(/\s/g, ""));

const btnStyle = {
  width:"100%", height:48, background:G, color:"#fff",
  border:"none", borderRadius:8, fontWeight:600,
  fontSize:15, cursor:"pointer", transition:"opacity 0.2s",
};

export default function ForgotPasswordPopup({ onClose }) {
  const [step,    setStep]    = useState("input");
  const [value,   setValue]   = useState("");
  const [otp,     setOtp]     = useState(["", "", "", "", "", ""]);
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const [timer,   setTimer]   = useState(0);

  const startTimer = () => {
    setTimer(30);
    const iv = setInterval(() => setTimer(t => { if (t <= 1) { clearInterval(iv); return 0; } return t - 1; }), 1000);
  };

  // Step 1: Send reset link or OTP
  const handleSubmit = async () => {
    setError("");
    if (!value.trim()) { setError("Please enter email or phone number"); return; }
    if (!isEmail(value) && !isPhone(value)) {
      setError("Enter a valid email or 10-digit mobile number"); return;
    }
    setLoading(true);
    try {
      const res  = await fetch(`${API}/forgot`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ identifier: value.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        isEmail(value) ? setStep("emailSent") : setStep("otp");
        startTimer();
      } else {
        setError(data.message);
      }
    } catch {
      setError("Cannot connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // OTP input handler
  const handleOtpChange = (val, i) => {
    const newOtp = [...otp];
    newOtp[i] = val.replace(/\D/, "");
    setOtp(newOtp);
    if (val && i < 5) document.getElementById(`fotp-${i + 1}`)?.focus();
  };

  // Step 2: Verify OTP (phone forgot)
  const verifyOtp = async () => {
    setError("");
    const otpVal = otp.join("");
    if (otpVal.length < 6) { setError("Enter all 6 digits"); return; }
    setLoading(true);
    try {
      const res  = await fetch(`${API}/verify-otp`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ phone: value.trim(), otp: otpVal, purpose: "forgot" }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user",  JSON.stringify(data.user));
        setStep("success");
      } else {
        setError(data.message);
      }
    } catch {
      setError("Cannot connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const resendOtp = async () => {
    setOtp(["", "", "", "", "", ""]);
    setError("");
    try {
      const res  = await fetch(`${API}/resend-otp`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ phone: value.trim(), purpose: "forgot" }),
      });
      const data = await res.json();
      if (data.success) startTimer();
      else setError(data.message);
    } catch {
      setError("Failed to resend. Try again.");
    }
  };

  // Resend reset email
  const resendEmail = async () => {
    setError("");
    try {
      const res  = await fetch(`${API}/forgot`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ identifier: value.trim() }),
      });
      const data = await res.json();
      if (!data.success) setError(data.message);
      else startTimer();
    } catch {
      setError("Failed to resend. Try again.");
    }
  };

  return (
    <div
      style={{ position:"fixed", inset:0, background:"rgba(80,0,130,0.25)", backdropFilter:"blur(4px)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background:"#fff", borderRadius:"20px", padding:"36px 32px", width:"100%", maxWidth:"380px", textAlign:"center", position:"relative" }}>

        {/* Close */}
        <button
          onClick={onClose}
          style={{ position:"absolute", top:"12px", right:"12px", background:"none", border:"none", fontSize:"20px", cursor:"pointer", color:"#aaa", lineHeight:1, padding:"4px 8px", zIndex:10 }}
        >✕</button>

        {/* ── STEP 1: Input ── */}
        {step === "input" && <>
          <div style={{ fontSize:40, marginBottom:10 }}>🔐</div>
          <h3 style={{ ...gradText, fontSize:20, marginBottom:6 }}>Forgot Password?</h3>
          <p style={{ fontSize:13, color:"#999", marginBottom:20 }}>
            Enter your email — we'll send a reset link.<br/>
            Enter your phone — we'll send an OTP.
          </p>
          {error && <div style={{ color:"#991b1b", fontSize:13, marginBottom:10, textAlign:"left", background:"#fee2e2", padding:"8px 12px", borderRadius:8 }}>{error}</div>}
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Email or 10-digit phone number"
            style={{ width:"100%", height:48, padding:"0 14px", borderRadius:8, border:"1.5px solid #e0c8f8", outline:"none", marginBottom:14, fontSize:14, fontFamily:"inherit" }}
          />
          <button onClick={handleSubmit} disabled={loading} style={{ ...btnStyle, opacity: loading ? 0.7 : 1 }}>
            {loading ? "Sending..." : "Send Reset"}
          </button>
        </>}

        {/* ── STEP 2a: Email Sent ── */}
        {step === "emailSent" && <>
          <div style={{ fontSize:40, marginBottom:10 }}>📧</div>
          <h3 style={{ ...gradText, fontSize:20, marginBottom:6 }}>Check Your Email</h3>
          <p style={{ fontSize:13, color:"#999", marginBottom:20 }}>
            We've sent a password reset link to<br/>
            <strong style={{ color:"#333" }}>{value}</strong><br/><br/>
            Click the link in the email to reset your password.
          </p>
          {error && <div style={{ color:"red", fontSize:13, marginBottom:10 }}>{error}</div>}
          <button onClick={onClose} style={btnStyle}>Done</button>
          <p style={{ fontSize:13, color:"#999", marginTop:12 }}>
            Didn't receive?{" "}
            {timer > 0
              ? <span style={{ color:"#aaa" }}>Resend in {timer}s</span>
              : <span onClick={resendEmail} style={{ ...gradText, cursor:"pointer", fontWeight:600 }}>Resend Email</span>
            }
          </p>
        </>}

        {/* ── STEP 2b: OTP ── */}
        {step === "otp" && <>
          <div style={{ fontSize:40, marginBottom:10 }}>📱</div>
          <h3 style={{ ...gradText, fontSize:20, marginBottom:6 }}>Enter OTP</h3>
          <p style={{ fontSize:13, color:"#999", marginBottom:16 }}>
            6-digit OTP sent to your registered email<br/>
            <strong style={{ color:"#333" }}>for +91 {value}</strong>
          </p>
          {error && <div style={{ color:"#991b1b", fontSize:13, marginBottom:10, background:"#fee2e2", padding:"8px 12px", borderRadius:8 }}>{error}</div>}
          <div style={{ display:"flex", gap:8, justifyContent:"center", marginBottom:14 }}>
            {otp.map((d, i) => (
              <input
                key={i} id={`fotp-${i}`}
                value={d} maxLength={1} inputMode="numeric"
                onChange={(e) => handleOtpChange(e.target.value, i)}
                onKeyDown={(e) => e.key === "Backspace" && !d && i > 0 && document.getElementById(`fotp-${i-1}`)?.focus()}
                style={{ width:44, height:52, textAlign:"center", fontSize:20, fontWeight:700, borderRadius:8, border:"1.5px solid #e0c8f8", outline:"none" }}
              />
            ))}
          </div>
          <p style={{ fontSize:13, color:"#999", marginBottom:14 }}>
            Didn't get OTP?{" "}
            {timer > 0
              ? <span style={{ color:"#aaa" }}>Resend in {timer}s</span>
              : <span onClick={resendOtp} style={{ ...gradText, cursor:"pointer", fontWeight:600 }}>Resend OTP</span>
            }
          </p>
          <button onClick={verifyOtp} disabled={loading} style={{ ...btnStyle, opacity: loading ? 0.7 : 1 }}>
            {loading ? "Verifying..." : "Verify & Login"}
          </button>
        </>}

        {/* ── STEP 3: Success ── */}
        {step === "success" && <>
          <div style={{ fontSize:56, marginBottom:12 }}>✅</div>
          <h3 style={{ color:"#2e7d32", fontSize:20, fontWeight:700, marginBottom:6 }}>Verified!</h3>
          <p style={{ fontSize:13, color:"#999", marginBottom:20 }}>
            You have been verified and logged in successfully.
          </p>
          <button onClick={() => { onClose(); window.location.href = "/home"; }} style={btnStyle}>
            Go to Home
          </button>
        </>}

      </div>
    </div>
  );
}