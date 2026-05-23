import { useState, useEffect } from "react";

export default function AboutContactPage() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  const services = [
    { icon: "👕", title: "Trendy Fashion", desc: "Latest clothing styles for every occasion — crafted for the modern wardrobe." },
    { icon: "🌸", title: "Premium Perfumes", desc: "Long-lasting fragrances that define your personality and leave a lasting impression." },
    { icon: "👟", title: "Stylish Footwear", desc: "Comfortable and trendy shoes designed for every look and lifestyle." },
  ];

  const reasons = [
    "Premium Quality Products",
    "Affordable Fashion",
    "Latest Trend Collections",
    "Fast & Reliable Delivery",
    "Customer Satisfaction Focus",
  ];

  const contacts = [
    { icon: "✉", label: "Email", value: "thezuro22@gmail.com", href: "mailto:thezuro22@gmail.com" },
    { icon: "☎", label: "Phone", value: "+91 877655456", href: "tel:+91877655456" },
    { icon: "◈", label: "Instagram", value: "@thezuro", href: "https://instagram.com/thezuro" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .about-page {
          font-family: 'Jost', sans-serif;
          background: #faf8f5;
          color: #1a1a1a;
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* ── HERO ── */
        .hero {
          position: relative;
          min-height: 297px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          background: linear-gradient(135deg, #a87c2a 0%, #c9a84c 40%, #e8cc6e 60%, #c9a84c 80%, #a87c2a 100%);
          overflow: hidden;
          padding: 80px 24px;
        }
        .hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.12) 0%, transparent 60%),
                      radial-gradient(ellipse at 70% 20%, rgba(255,255,255,0.08) 0%, transparent 50%);
        }
        .hero-deco-circle {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.25);
          pointer-events: none;
        }
        .hero-deco-circle:nth-child(1) { width: 500px; height: 500px; top: -120px; right: -100px; }
        .hero-deco-circle:nth-child(2) { width: 300px; height: 300px; bottom: -80px; left: -60px; }
        .hero-deco-circle:nth-child(3) { width: 150px; height: 150px; top: 40px; left: 10%; border-style: dashed; }

        .hero-content {
          position: relative;
          z-index: 2;
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.9s ease, transform 0.9s ease;
        }
        .hero-content.visible { opacity: 1; transform: translateY(0); }

        .hero-eyebrow {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.8);
          margin-bottom: 20px;
        }
        .hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(56px, 10vw, 96px);
          font-weight: 700;
          color: #fff;
          line-height: 1;
          letter-spacing: -2px;
          text-shadow: 0 4px 24px rgba(0,0,0,0.15);
          margin-bottom: 16px;
        }
        .hero-subtitle {
          font-size: 18px;
          font-weight: 300;
          color: rgba(255,255,255,0.9);
          letter-spacing: 2px;
          margin-bottom: 8px;
        }
        .hero-date {
          font-size: 12px;
          color: rgba(255,255,255,0.65);
          letter-spacing: 3px;
          text-transform: uppercase;
        }

        /* ── SECTION COMMON ── */
        .section {
          max-width: 1100px;
          margin: 0 auto;
          padding: 80px 48px;
        }
        .section-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #B8933A;
          margin-bottom: 12px;
        }
        .section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(32px, 4vw, 48px);
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1.15;
          margin-bottom: 24px;
        }
        .section-divider {
          width: 48px;
          height: 2px;
          background: linear-gradient(90deg, #a87c2a, #e8cc6e);
          margin-bottom: 28px;
        }

        /* ── ABOUT TEXT ── */
        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }
        .about-text p {
          font-size: 16px;
          line-height: 1.85;
          color: #555;
          font-weight: 300;
        }
        .about-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px;
          background: #e8ddd5;
        }
        .stat-box {
          background: #fff;
          padding: 32px 28px;
          text-align: center;
        }
        .stat-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 42px;
          font-weight: 700;
          color: #B8933A;
          line-height: 1;
          margin-bottom: 6px;
        }
        .stat-label {
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #888;
        }

        /* ── SERVICES ── */
        .services-bg {
          background: #1a1a1a;
          padding: 80px 0;
        }
        .services-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 48px;
        }
        .services-title { color: #fff; }
        .services-label { color: #B8933A; }
        .services-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: #333;
          margin-top: 48px;
        }
        .service-card {
          background: #1a1a1a;
          padding: 40px 32px;
          transition: background 0.3s;
          cursor: default;
        }
        .service-card:hover { background: #242424; }
        .service-icon {
          font-size: 36px;
          margin-bottom: 20px;
          display: block;
        }
        .service-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 600;
          color: #fff;
          margin-bottom: 12px;
          letter-spacing: 0.5px;
        }
        .service-desc {
          font-size: 14px;
          line-height: 1.7;
          color: #888;
          font-weight: 300;
        }
        .service-line {
          width: 32px;
          height: 1px;
          background: #B8933A;
          margin-top: 24px;
          transition: width 0.3s;
        }
        .service-card:hover .service-line { width: 64px; }

        /* ── WHY CHOOSE ── */
        .why-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }
        .why-list { list-style: none; }
        .why-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 18px 0;
          border-bottom: 1px solid #f0eae0;
          font-size: 15px;
          color: #333;
          font-weight: 400;
          transition: color 0.2s;
        }
        .why-item:hover { color: #B8933A; }
        .why-item::before {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #B8933A;
          flex-shrink: 0;
        }
        .why-visual {
          background: linear-gradient(135deg, #a87c2a, #c9a84c, #e8cc6e);
          padding: 48px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .why-visual::before {
          content: '';
          position: absolute;
          width: 200px; height: 200px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.3);
          top: -50px; right: -50px;
        }
        .why-visual-brand {
          font-family: 'Cormorant Garamond', serif;
          font-size: 64px;
          font-weight: 700;
          color: rgba(255,255,255,0.2);
          line-height: 1;
          margin-bottom: 16px;
        }
        .why-visual-tagline {
          font-size: 13px;
          color: rgba(255,255,255,0.9);
          letter-spacing: 3px;
          text-transform: uppercase;
          font-weight: 500;
        }
        .why-visual-sub {
          font-size: 11px;
          color: rgba(255,255,255,0.65);
          letter-spacing: 2px;
          margin-top: 8px;
        }

        /* ── CONTACT ── */
        .contact-bg {
          background: #1a1a1a;
          padding: 80px 0;
        }
        .contact-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 48px;
        }
        .contact-title { color: #fff; }
        .contact-label { color: #B8933A; }
        .contact-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: #333;
          margin-top: 48px;
        }
        .contact-card {
          background: #1a1a1a;
          padding: 36px 32px;
          text-decoration: none;
          display: block;
          transition: background 0.3s;
        }
        .contact-card:hover { background: #242424; }
        .contact-icon {
          font-size: 24px;
          color: #B8933A;
          margin-bottom: 16px;
          display: block;
          font-style: normal;
        }
        .contact-clabel {
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #666;
          margin-bottom: 8px;
        }
        .contact-value {
          font-size: 15px;
          color: #fff;
          font-weight: 400;
          letter-spacing: 0.3px;
          transition: color 0.2s;
        }
        .contact-card:hover .contact-value { color: #B8933A; }
        .contact-arrow {
          font-size: 18px;
          color: #444;
          margin-top: 16px;
          display: block;
          transition: color 0.2s, transform 0.2s;
        }
        .contact-card:hover .contact-arrow { color: #B8933A; transform: translateX(4px); }

        /* ── FOOTER ── */
        .footer {
          text-align: center;
          padding: 40px 24px;
          background: #111;
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #444;
        }
        .footer span { color: #B8933A; }

        /* ── RESPONSIVE ── */
        @media (max-width: 768px) {
          .section { padding: 56px 24px; }
          .about-grid { grid-template-columns: 1fr; gap: 40px; }
          .why-grid { grid-template-columns: 1fr; gap: 40px; }
          .services-grid { grid-template-columns: 1fr; }
          .contact-grid { grid-template-columns: 1fr; }
          .about-stats { grid-template-columns: 1fr 1fr; }
          .services-inner { padding: 0 24px; }
          .contact-inner { padding: 0 24px; }
        }
      `}</style>

      <div className="about-page">

        {/* HERO */}
        <section className="hero">
          <div className="hero-deco-circle" />
          <div className="hero-deco-circle" />
          <div className="hero-deco-circle" />
          <div className={`hero-content ${visible ? "visible" : ""}`}>
            <div className="hero-eyebrow">India's Premium Fashion House</div>
            <h1 className="hero-title">theZuro</h1>
            <p className="hero-subtitle">Wear Confidence. Live Style.</p>
            <p className="hero-date">Founded March 2026</p>
          </div>
        </section>

        {/* ABOUT */}
        <section className="section">
          <div className="about-grid">
            <div className="about-text">
              <div className="section-label">Our Story</div>
              <h2 className="section-title">Fashion that speaks before you do</h2>
              <div className="section-divider" />
              <p>
                theZuro is a modern fashion and lifestyle brand built for people who love style,
                confidence, and trend-driven fashion at affordable prices. We bring together
                clothing, perfumes, shoes, and lifestyle essentials designed for today's generation.
              </p>
            </div>
            <div className="about-stats">
              <div className="stat-box">
                <div className="stat-num">2026</div>
                <div className="stat-label">Founded</div>
              </div>
              <div className="stat-box">
                <div className="stat-num">3+</div>
                <div className="stat-label">Categories</div>
              </div>
              <div className="stat-box">
                <div className="stat-num">100%</div>
                <div className="stat-label">Authentic</div>
              </div>
              <div className="stat-box">
                <div className="stat-num">Pan</div>
                <div className="stat-label">India Delivery</div>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <div className="services-bg">
          <div className="services-inner">
            <div className="section-label services-label">What We Offer</div>
            <h2 className="section-title services-title">Built for every style</h2>
            <div className="services-grid">
              {services.map(({ icon, title, desc }) => (
                <div className="service-card" key={title}>
                  <span className="service-icon">{icon}</span>
                  <div className="service-name">{title}</div>
                  <p className="service-desc">{desc}</p>
                  <div className="service-line" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* WHY CHOOSE */}
        <section className="section">
          <div className="why-grid">
            <div>
              <div className="section-label">Why theZuro</div>
              <h2 className="section-title">The difference is in the details</h2>
              <div className="section-divider" />
              <ul className="why-list">
                {reasons.map(r => (
                  <li className="why-item" key={r}>{r}</li>
                ))}
              </ul>
            </div>
            <div className="why-visual">
              <div className="why-visual-brand">Z</div>
              <div className="why-visual-tagline">theZuro</div>
              <div className="why-visual-sub">Wear Confidence. Live Style.</div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <div className="contact-bg">
          <div className="contact-inner">
            <div className="section-label contact-label">Get In Touch</div>
            <h2 className="section-title contact-title">We'd love to hear from you</h2>
            <div className="contact-grid">
              {contacts.map(({ icon, label, value, href }) => (
                <a className="contact-card" href={href} key={label} target="_blank" rel="noreferrer">
                  <i className="contact-icon">{icon}</i>
                  <div className="contact-clabel">{label}</div>
                  <div className="contact-value">{value}</div>
                  <span className="contact-arrow">→</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="footer">
          © {new Date().getFullYear()} <span>theZuro</span> — All rights reserved
        </footer>

      </div>
    </>
  );
}