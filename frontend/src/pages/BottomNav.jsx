import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import theme from "./theme";
// const theme = {
//   primary: "#9400D3",
//   accent: "#ED80E9",
//   lightPurple: "#D3D3FF",
//   muted: "#D8BFD8",
//   white: "#ffffff",
//   dark: "#1a1a2e",
//   footerBg: "#f5f5f6",
//   footerText: "#696b79",
//   footerHeading: "#1a1a2e",
// };

/* ── Mobile Icons ── */
const HomeIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? theme.primary : "none"} stroke={active ? theme.primary : "#888"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" />
    <path d="M9 21V12h6v9" />
  </svg>
);
const BrowseIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? theme.primary : "#888"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="15" y2="12" /><line x1="3" y1="18" x2="18" y2="18" />
  </svg>
);
const ProfileIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? theme.primary : "#888"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" fill={active ? theme.lightPurple : "none"} />
  </svg>
);
const BellIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? theme.primary : "#888"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const BagIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? theme.primary : "#888"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

/* ── Social Icons ── */
const FbIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const TwIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  </svg>
);
const YtIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.4 19.54C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
  </svg>
);
const IgIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const mobileTabs = [
  { id: "home", label: "Home", Icon: HomeIcon },
  { id: "browse", label: "Browse", Icon: BrowseIcon },
  { id: "profile", label: "Profile", Icon: ProfileIcon },
  { id: "notifications", label: "Notifications", Icon: BellIcon },
  { id: "bag", label: "Bag", Icon: BagIcon, badge: 1 },
];

const ZuroLogoSmall = () => (
  <svg width="28" height="28" viewBox="0 0 44 44" fill="none">
    <path d="Z6 34 L6 10 C6 10 10 10 13 16 L22 32 L31 16 C34 10 38 10 38 10 L38 34"
      stroke="url(#lg2)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <defs>
      <linearGradient id="lg2" x1="6" y1="10" x2="38" y2="34" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#9400D3" /><stop offset="100%" stopColor="#ED80E9" />
      </linearGradient>
    </defs>
  </svg>
);

export default function BottomNav() {

  // ✅ ADD HERE (inside component, before return)
  const policies = [
    { label: "Contact Us", path: "/contact" },
    { label: "FAQ", path: "/faq" },
    { label: "T&C", path: "/tc" },
    { label: "Terms Of Use", path: "/terms" },
    { label: "Track Orders", path: "/track-orders" },
    { label: "Shipping", path: "/shipping" },
    { label: "Cancellation", path: "/cancellation" },
    { label: "Privacy Policy", path: "/privacy-policy" },
    // { label: "Grievance Redressal", path: "/grievance" },
    // { label: "FSSAI Food Safety", path: "/fssai" },
    // { label: "Connect App", path: "/app" },
  ];
  const [active, setActive] = useState("home");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ══════════════ MOBILE BOTTOM NAV ══════════════ */
  if (isMobile) {
    return (
      <>
        <div style={{ height: 68 }} />
        <nav style={{
          position: "fixed", bottom: 0, left: 0, right: 0, height: 60,
          background: theme.white,
          borderTop: `1px solid ${theme.lightPurple}`,
          boxShadow: "0 -2px 12px rgba(148,0,211,0.10)",
          display: "flex", alignItems: "center", justifyContent: "space-around",
          zIndex: 9999, fontFamily: "'Helvetica Neue', Arial, sans-serif",
          padding: "0 4px",
        }}>
          {mobileTabs.map(({ id, label, Icon, badge }) => {
            const isActive = active === id;
            return (
              <button key={id} onClick={() => setActive(id)} style={{
                background: "none", border: "none", cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", gap: 2, flex: 1, padding: "4px 0",
                position: "relative",
              }}>
                {/* active top bar */}
                {isActive && (
                  <span style={{
                    position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)",
                    width: 28, height: 2.5, borderRadius: "0 0 3px 3px",
                    background: `linear-gradient(90deg, ${theme.primary}, ${theme.accent})`,
                  }} />
                )}
                {/* icon */}
                <span style={{
                  position: "relative", display: "flex", alignItems: "center", justifyContent: "center",
                  width: 34, height: 34, borderRadius: "50%",
                  background: isActive ? `${theme.lightPurple}55` : "transparent",
                }}>
                  <Icon active={isActive} />
                  {badge && (
                    <span style={{
                      position: "absolute", top: 2, right: 1,
                      background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
                      color: "#fff", fontSize: 8, fontWeight: 700,
                      width: 14, height: 14, borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>{badge}</span>
                  )}
                </span>
                <span style={{
                  fontSize: 10, fontWeight: isActive ? 700 : 400,
                  color: isActive ? theme.primary : "#999",
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                }}>{label}</span>
              </button>
            );
          })}
        </nav>
      </>
    );
  }

  /* ══════════════ DESKTOP FOOTER ══════════════ */
  return (
    <footer style={{
      background: theme.footerBg,
      borderTop: `1px solid ${theme.muted}`,
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
      marginTop: 40,
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 40px 24px" }}>

        {/* ── Main footer columns ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1.4fr 1fr", gap: 48, marginBottom: 40 }}>

          {/* Col 1 — Online Shopping + Useful Links */}
          <div>
            <h4 style={{
              fontSize: 13,
              fontWeight: 800,
              color: "#fff",
              letterSpacing: 1,
              margin: "0 0 14px"
            }}>
              ONLINE SHOPPING
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: 10 }}>
              {["Men", "Women", "Kids", "Home", "Beauty", "Genz", "Gift Cards", "The Zuro Insider"].map(l => (
                <li key={l}>
                  <a href="#" style={{ fontSize: 13, color: theme.footerText, textDecoration: "none" }}
                    onMouseEnter={e => e.target.style.color = theme.primary}
                    onMouseLeave={e => e.target.style.color = theme.footerText}>{l}</a>
                </li>
              ))}
            </ul>

            {/* <h4 style={{ fontSize: 13, fontWeight: 800, color: theme.footerHeading, letterSpacing: 1, margin: "0 0 16px" }}>
              USEFUL LINKS
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {["Blog", "Careers", "Site Map", "Corporate Information", "Whitehat"].map(l => (
                <li key={l}>
                  <a href="#" style={{ fontSize: 13, color: theme.footerText, textDecoration: "none" }}
                    onMouseEnter={e => e.target.style.color = theme.primary}
                    onMouseLeave={e => e.target.style.color = theme.footerText}>{l}</a>
                </li>
              ))}
            </ul> */}
          </div>

          {/* Col 2 — Customer Policies */}
          <div>
            <h4 style={{
              fontSize: 13,
              fontWeight: 800,
              color: "#fff",
              letterSpacing: 1,
              margin: "0 0 14px"
            }}>
              CUSTOMER POLICIES
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {policies.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    style={{
                      fontSize: 13,
                      color: theme.footerText,
                      textDecoration: "none"
                    }}
                    onMouseEnter={(e) => (e.target.style.color = theme.primary)}
                    onMouseLeave={(e) => (e.target.style.color = theme.footerText)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — App + Social */}
          <div>
            {/* <h4 style={{ fontSize: 13, fontWeight: 800, color: theme.footerHeading, letterSpacing: 1, margin: "0 0 16px" }}>
              EXPERIENCE THE ZURO APP ON MOBILE
            </h4>
            <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>              <a href="#" style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "#000", borderRadius: 8, padding: "10px 16px",
                textDecoration: "none", minWidth: 130,
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M3 3.5L13.5 12 3 20.5V3.5z" fill="#EA4335"/>
                  <path d="M3 3.5l10.5 8.5L20 6.5 3 3.5z" fill="#FBBC04"/>
                  <path d="M3 20.5l10.5-8.5L20 17.5 3 20.5z" fill="#34A853"/>
                  <path d="M13.5 12L20 6.5v11L13.5 12z" fill="#4285F4"/>
                </svg>
                <div>
                  <div style={{ fontSize: 9, color: "#ccc", lineHeight: 1 }}>GET IT ON</div>
                  <div style={{ fontSize: 13, color: "#fff", fontWeight: 600, lineHeight: 1.4 }}>Google Play</div>
                </div>
              </a>
              <a href="#" style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "#000", borderRadius: 8, padding: "10px 16px",
                textDecoration: "none", minWidth: 130,
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div>
                  <div style={{ fontSize: 9, color: "#ccc", lineHeight: 1 }}>Download on the</div>
                  <div style={{ fontSize: 13, color: "#fff", fontWeight: 600, lineHeight: 1.4 }}>App Store</div>
                </div>
              </a>
            </div> */}
            {/* 
            <h4 style={{ fontSize: 13, fontWeight: 800, color: theme.footerHeading, letterSpacing: 1, margin: "0 0 14px" }}>
              KEEP IN TOUCH
            </h4>
            <div style={{ display: "flex", gap: 14 }}>
              {[
                { Icon: FbIcon, color: "#1877F2" },
                { Icon: TwIcon, color: "#1DA1F2" },
                { Icon: YtIcon, color: "#FF0000" },
                { Icon: IgIcon, color: "#E1306C" },
              ].map(({ Icon, color }, i) => (
                <a key={i} href="#" style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "#fff", border: `1px solid ${theme.muted}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#888", textDecoration: "none", transition: "all 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.color = color; e.currentTarget.style.borderColor = color; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "#888"; e.currentTarget.style.borderColor = theme.muted; }}
                >
                  <Icon />
                </a>
              ))}
            </div> */}

            <h4 style={{
              fontSize: 13,
              fontWeight: 800,
              color: "#fff",
              letterSpacing: 1,
              margin: "0 0 14px"
            }}>
              KEEP IN TOUCH
            </h4>

            <div style={{ display: "flex", gap: 14 }}>
              <a
                href="https://www.instagram.com/thezuro22?igsh=aWgyZTU1MjgzM3V0"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "#fff",
                  border: `1px solid ${theme.muted}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#888",
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#E1306C";
                  e.currentTarget.style.borderColor = "#E1306C";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#888";
                  e.currentTarget.style.borderColor = theme.muted;
                }}
              >
                <IgIcon />
              </a>
            </div>
          </div>

          {/* Col 4 — Trust badges */}
          <div style={{ display: "flex", flexDirection: "column", gap: 28 , color: "#fff"}}>
            {/* 100% Original */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div style={{
                width: 48, height: 48, borderRadius: "50%",
                border: `2px solid ${theme.muted}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, fontSize: 20,
              }}>✅</div>
              <div>
                <p style={{ margin: 0, fontSize: 13, color: theme.footerHeading, lineHeight: 1.5 }}>
                  <strong>100% ORIGINAL</strong> guarantee for all products at thezuro.com
                </p>
              </div>
            </div>

            {/* Return policy */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 , color: "#fff"}}>
              <div style={{
                width: 48, height: 48, borderRadius: 8,
                border: `2px solid ${theme.muted}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, fontSize: 13, fontWeight: 800, color: theme.footerHeading,
              }}>14</div>
              <div>
                <p style={{ margin: 0, fontSize: 13, color: theme.footerHeading, lineHeight: 1.5 }}>
                  <strong>Return within 14 days</strong> of receiving your order
                </p>
              </div>
            </div>

            {/* Secure payments */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 , }}>
              {/* <div style={{
                width: 48, height: 48, borderRadius: "50%",
                border: `2px solid ${theme.muted}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, fontSize: 20,
              }}>🔒</div> */}
              <div>
                {/* <p style={{ margin: 0, fontSize: 13, color: theme.footerHeading, lineHeight: 1.5 }}>
                  <strong>Secure Payments</strong> with 256-bit SSL encryption
                </p> */}
              </div>
            </div>
          </div>

        </div>

        {/* ── Divider ── */}
        <div style={{ borderTop: `1px solid ${theme.muted}`, paddingTop: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ZuroLogoSmall />
            <span style={{ fontSize: 12, color: theme.footerText }}>
              © {new Date().getFullYear()} <strong style={{ color: theme.primary }}>The Zuro</strong>. All rights reserved.
            </span>
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            {[
              { label: "Privacy Policy", path: "/privacy-policy" },
              { label: "Terms of Use", path: "/terms" },
              // { label: "Accessibility", path: "/accessibility" },
            ].map(item => (
              <Link
                key={item.label}
                to={item.path}
                style={{
                  fontSize: 12,
                  color: theme.footerText,
                  textDecoration: "none"
                }}
                onMouseEnter={e => e.target.style.color = theme.primary}
                onMouseLeave={e => e.target.style.color = theme.footerText}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
