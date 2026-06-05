import { useState } from "react";
import { CONTACT_API_URL } from "../config/api";

// ── NO SETUP NEEDED — emails go directly via the user's email app ──────────
// Change this to your email address where you want to receive messages
const YOUR_EMAIL = "thezuro22@gmail.com";
// ──────────────────────────────────────────────────────────────────────────

const theme = { gold: "#B8933A" };

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={theme.gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);
const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={theme.gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.91 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.82 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const WhatsappIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={theme.gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
);
const LocationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={theme.gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);
const TruckIcon      = () => <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/><rect x="9" y="11" width="14" height="10" rx="2"/><circle cx="12" cy="21" r="1"/><circle cx="20" cy="21" r="1"/></svg>;
const ShieldIcon     = () => <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const LockIcon       = () => <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const HeadphonesIcon = () => <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>;
const GoldStar       = () => <svg width="14" height="14" viewBox="0 0 24 24" fill={theme.gold} stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const SmallLock      = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;

export default function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  // const handleSubmit = () => {
  //   // Validation
  //   if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
  //     setError("Name, Email, and Message are required fields.");
  //     return;
  //   }
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   if (!emailRegex.test(form.email)) {
  //     setError("Please enter a valid email address.");
  //     return;
  //   }
  //   setError("");

  //   // Build mailto link — opens user's Gmail/Outlook/any email app
  //   const subject = encodeURIComponent(
  //     form.subject.trim() ? `[TheZuro] ${form.subject.trim()}` : "[TheZuro] New Contact Form Message"
  //   );
  //   const body = encodeURIComponent(
  //     `Name: ${form.name.trim()}\n` +
  //     `Email: ${form.email.trim()}\n` +
  //     `Phone: ${form.phone.trim() || "Not provided"}\n\n` +
  //     `Message:\n${form.message.trim()}`
  //   );

  //   window.location.href = `mailto:${YOUR_EMAIL}?subject=${subject}&body=${body}`;

  //   // Show success after a short delay
  //   setTimeout(() => setSent(true), 500);
  // };

  
  const handleSubmit = async () => {

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Name, Email, and Message are required fields.");
      return;
    }
  
    try {
  
      const response = await fetch(
        `${CONTACT_API_URL}/send-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );
  
      const data = await response.json();
  
      if (data.success) {
  
        setSent(true);
  
        setForm({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
  
      } else {
  
        setError("Failed to send email");
  
      }
  
    } catch (error) {
  
      console.log(error);
  
      setError("Something went wrong");
  
    }
  };
  const contactItems = [
    { icon: <MailIcon />,     title: "EMAIL US",     line1: "support@thezuro.com",  line2: "We'll reply as soon as possible." },
    { icon: <PhoneIcon />,    title: "CALL US",       line1: "+91 12345 67890",      line2: "Mon – Sat | 10:00 AM – 7:00 PM" },
    { icon: <WhatsappIcon />, title: "WHATSAPP US",  line1: "+91 12345 67890",      line2: "Chat with us on WhatsApp." },
    { icon: <LocationIcon />, title: "OUR LOCATION", line1: "India",                line2: "We ship across India." },
  ];

  const features = [
    { icon: <TruckIcon />,      title: "FAST SHIPPING",   sub: "Pan India Delivery" },
    { icon: <ShieldIcon />,     title: "PREMIUM QUALITY", sub: "Selected with love" },
    { icon: <LockIcon />,       title: "SECURE PAYMENT",  sub: "100% Safe & Trusted" },
    { icon: <HeadphonesIcon />, title: "SUPPORT 24/7",    sub: "We're always here" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Jost', sans-serif; background: #fff; color: #1a1a1a; }
        .zh-banner { width: 100%; background: linear-gradient(135deg, #a87c2a, #c9a84c, #e8cc6e, #c9a84c, #a87c2a); min-height: 340px; display: flex; align-items: center; overflow: hidden; }
        .zh-banner-content { max-width: 1200px; margin: 0 auto; padding: 60px 48px; display: flex; align-items: center; justify-content: space-between; width: 100%; }
        .zh-banner-text { flex: 1; max-width: 480px; }
        .zh-banner-label { font-size: 11px; font-weight: 700; letter-spacing: 3px; color: rgba(255,255,255,0.85); text-transform: uppercase; margin-bottom: 18px; }
        .zh-banner-h1 { font-family: 'Cormorant Garamond', serif; font-size: 52px; font-weight: 700; line-height: 1.12; color: #fff; margin-bottom: 20px; text-shadow: 0 2px 12px rgba(0,0,0,0.15); }
        .zh-banner-sub { font-size: 15px; color: rgba(255,255,255,0.85); line-height: 1.7; }
        .zh-banner-deco { flex-shrink: 0; width: 340px; height: 260px; position: relative; display: flex; align-items: center; justify-content: center; }
        .deco-circle-lg { position: absolute; width: 220px; height: 220px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.35); top: 20px; right: 20px; }
        .deco-circle-sm { position: absolute; width: 100px; height: 100px; border-radius: 50%; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.4); bottom: 30px; left: 20px; }
        .deco-envelope { position: relative; z-index: 2; width: 140px; height: 100px; background: #fff; border-radius: 4px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; }
        .deco-brand-card { position: absolute; bottom: 20px; right: 0; width: 120px; background: #fff; border-radius: 4px; padding: 14px 16px; text-align: center; }
        .deco-brand-name { font-family: 'Cormorant Garamond', serif; font-size: 14px; font-weight: 700; letter-spacing: 3px; color: #1a1a1a; }
        .deco-brand-sub { font-size: 7px; letter-spacing: 2px; color: #B8933A; margin-top: 4px; }
        .deco-heart { margin-top: 6px; color: #B8933A; font-size: 13px; }
        .zh-main { max-width: 1200px; margin: 0 auto; padding: 64px 48px; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; }
        .section-label { font-size: 13px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #1a1a1a; display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
        .section-desc { font-size: 14px; color: #888; margin-bottom: 36px; }
        .contact-item { display: flex; align-items: flex-start; gap: 18px; padding: 20px 0; border-bottom: 1px solid #f0eae0; }
        .contact-icon-wrap { width: 46px; height: 46px; border-radius: 50%; background: #f5ede6; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
        .contact-title { font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #1a1a1a; margin-bottom: 5px; }
        .contact-line1 { font-size: 14px; color: #333; font-weight: 500; margin-bottom: 3px; }
        .contact-line2 { font-size: 12.5px; color: #888; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
        .form-input { width: 100%; padding: 13px 16px; border: 1px solid #e8ddd5; border-radius: 4px; font-family: 'Jost', sans-serif; font-size: 13.5px; color: #1a1a1a; background: #fff; outline: none; transition: border-color 0.2s; }
        .form-input::placeholder { color: #bbb; }
        .form-input:focus { border-color: #B8933A; }
        .form-textarea { width: 100%; padding: 13px 16px; border: 1px solid #e8ddd5; border-radius: 4px; font-family: 'Jost', sans-serif; font-size: 13.5px; color: #1a1a1a; background: #fff; outline: none; resize: none; height: 130px; transition: border-color 0.2s; margin-bottom: 14px; }
        .form-textarea::placeholder { color: #bbb; }
        .form-textarea:focus { border-color: #B8933A; }
        .error-msg { color: #c0392b; font-size: 13px; margin-bottom: 12px; background: #fdf0ee; padding: 10px 14px; border-radius: 4px; border-left: 3px solid #c0392b; line-height: 1.5; }
        .submit-btn { background: linear-gradient(135deg, #a87c2a, #c9a84c, #e8cc6e, #c9a84c, #a87c2a); background-size: 200% auto; color: #fff; border: none; cursor: pointer; padding: 15px 36px; font-family: 'Jost', sans-serif; font-size: 13px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; border-radius: 3px; transition: background-position 0.4s, box-shadow 0.2s; display: flex; align-items: center; gap: 10px; text-shadow: 0 1px 2px rgba(0,0,0,0.2); box-shadow: 0 4px 18px rgba(168,124,42,0.35); }
        .submit-btn:hover { background-position: right center; box-shadow: 0 6px 24px rgba(168,124,42,0.5); }
        .privacy-note { display: flex; align-items: center; gap: 7px; font-size: 12px; color: #999; margin-top: 14px; }
        .success-box { padding: 40px; text-align: center; background: #f9f6f0; border: 1px solid #e8ddd5; border-radius: 4px; }
        .success-icon { font-size: 40px; margin-bottom: 14px; }
        .success-title { font-family: 'Cormorant Garamond', serif; font-size: 26px; font-weight: 700; margin-bottom: 10px; }
        .success-sub { font-size: 14px; color: #888; line-height: 1.6; }
        .zh-features { background: linear-gradient(135deg, #a87c2a, #c9a84c, #e8cc6e, #c9a84c, #a87c2a); }
        .zh-features-inner { max-width: 1200px; margin: 0 auto; padding: 32px 48px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
        .feature-item { display: flex; align-items: center; gap: 16px; }
        .feature-text-title { font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #fff; }
        .feature-text-sub { font-size: 12px; color: rgba(255,255,255,0.8); margin-top: 2px; }
        @media (max-width: 900px) {
          .zh-main { grid-template-columns: 1fr; gap: 48px; padding: 40px 24px; }
          .zh-features-inner { grid-template-columns: 1fr 1fr; padding: 24px; }
          .zh-banner-content { padding: 40px 24px; flex-direction: column; gap: 32px; }
          .zh-banner-deco { display: none; }
          .zh-banner-h1 { font-size: 36px; }
        }
        @media (max-width: 600px) {
          .form-row { grid-template-columns: 1fr; }
          .zh-features-inner { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* BANNER */}
      <div className="zh-banner">
        <div className="zh-banner-content">
          <div className="zh-banner-text">
            <div className="zh-banner-label">Contact Us</div>
            <h1 className="zh-banner-h1">We'd Love to<br />Hear From You<span style={{ color: "rgba(255,255,255,0.7)" }}> ✦</span></h1>
            <p className="zh-banner-sub">Have a question, feedback, or just want to say hello? We're here for you!</p>
          </div>
          <div className="zh-banner-deco">
            <div className="deco-circle-lg" />
            <div className="deco-circle-sm" />
            <div className="deco-envelope">
              <svg width="36" height="28" viewBox="0 0 36 28" fill="none">
                <rect x="1" y="1" width="34" height="26" rx="3" fill="#f9f4ef" stroke="#B8933A" strokeWidth="1.2"/>
                <path d="M1 4l17 12L35 4" stroke="#B8933A" strokeWidth="1.2" fill="none"/>
              </svg>
              <span style={{ fontSize: 10, color: "#B8933A", letterSpacing: 2, fontWeight: 600 }}>THEZURO</span>
            </div>
            <div className="deco-brand-card">
              <div className="deco-brand-name">THEZURO</div>
              <div className="deco-brand-sub">THANK YOU</div>
              <div className="deco-heart">♥</div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="zh-main">
        {/* LEFT */}
        <div>
          <div className="section-label">GET IN TOUCH <GoldStar /></div>
          <p className="section-desc">We are always happy to help you.</p>
          {contactItems.map(({ icon, title, line1, line2 }) => (
            <div className="contact-item" key={title}>
              <div className="contact-icon-wrap">{icon}</div>
              <div>
                <div className="contact-title">{title}</div>
                <div className="contact-line1">{line1}</div>
                <div className="contact-line2">{line2}</div>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT */}
        <div>
          <div className="section-label">SEND US A MESSAGE <GoldStar /></div>
          <p className="section-desc" style={{ marginBottom: 24 }}>&nbsp;</p>

          {sent ? (
            <div className="success-box">
              <div className="success-icon">✉️</div>
              <div className="success-title">Message Sent successfully!</div>
              {/* <p className="success-sub">
                Your email app opened with the message ready.<br />
                Please click <strong>Send</strong> in your email app to complete sending.
              </p> */}
            </div>
          ) : (
            <>
              <div className="form-row">
                <input className="form-input" placeholder="Your Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                <input className="form-input" placeholder="Email Address *" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <input className="form-input" placeholder="Phone Number" style={{ marginBottom: 14, display: "block" }} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              <input className="form-input" placeholder="Subject" style={{ marginBottom: 14, display: "block" }} value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
              <textarea className="form-textarea" placeholder="Your Message *" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
              {error && <div className="error-msg">⚠ {error}</div>}
              <button className="submit-btn" onClick={handleSubmit}>
                SEND MESSAGE
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
              <div className="privacy-note"><SmallLock /> We respect your privacy. Your information is safe with us.</div>
            </>
          )}
        </div>
      </div>

      {/* FEATURES */}
      <div className="zh-features">
        <div className="zh-features-inner">
          {features.map(({ icon, title, sub }) => (
            <div className="feature-item" key={title}>
              {icon}
              <div>
                <div className="feature-text-title">{title}</div>
                <div className="feature-text-sub">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}