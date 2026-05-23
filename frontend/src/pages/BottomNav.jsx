import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import theme from "./theme";

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
const IgIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const ZuroLogoSmall = () => (
  <svg width="28" height="28" viewBox="0 0 44 44" fill="none">
    <path d="M6 34 L6 10 C6 10 10 10 13 16 L22 32 L31 16 C34 10 38 10 38 10 L38 34"
      stroke="url(#lg2)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <defs>
      <linearGradient id="lg2" x1="6" y1="10" x2="38" y2="34" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#9400D3" />
        <stop offset="100%" stopColor="#ED80E9" />
      </linearGradient>
    </defs>
  </svg>
);

// Each tab maps to a real route from App.jsx.
// "browse" and "notifications" don't have dedicated routes yet, so they fall
// back to /home — update the path when you add those pages.
const mobileTabs = [
  { id: "home",          label: "Home",          path: "/home",          Icon: HomeIcon },
  { id: "browse",        label: "Browse",        path: "/home",          Icon: BrowseIcon },       // update when /browse exists
  { id: "profile",       label: "Profile",       path: "/profile",       Icon: ProfileIcon },
  { id: "notifications", label: "Alerts",        path: "/home",          Icon: BellIcon },         // update when /notifications exists
  { id: "bag",           label: "Bag",           path: "/bag",           Icon: BagIcon },
];

// Map route paths to the tab id they belong to, for accurate active detection.
const pathToTab = {
  "/home":    "home",
  "/profile": "profile",
  "/bag":     "bag",
  "/wishlist": "home",   // wishlist has its own page but no bottom tab — falls back to home highlight
};

const policies = [
  { label: "Contact Us",     path: "/contact" },
  { label: "FAQ",            path: "/faq" },
  { label: "T&C",            path: "/tc" },
  { label: "Terms Of Use",   path: "/terms" },
  // { label: "Track Orders",   path: "/track-orders" },
  { label: "AboutUs",   path: "/about-us" },
  { label: "Shipping",       path: "/shipping" },
  { label: "Cancellation",   path: "/cancellation" },
  { label: "Privacy Policy", path: "/privacy-policy" },
];

export default function BottomNav() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Derive the active tab from the current URL path.
  const active = pathToTab[location.pathname] ?? "home";

  /* ══ MOBILE BOTTOM NAV ══ */
  if (isMobile) {
    return (
      <>
        <div style={{ height: 68 }} />
        <nav style={{
          position: "fixed", bottom: 0, left: 0, right: 0, height: 60,
          background: "#ffffff",
          borderTop: `1px solid ${theme.lightPurple}`,
          boxShadow: "0 -2px 12px rgba(148,0,211,0.10)",
          display: "flex", alignItems: "center", justifyContent: "space-around",
          zIndex: 9999,
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
          padding: "0 4px",
        }}>
          {mobileTabs.map(({ id, label, Icon, path }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                onClick={() => navigate(path)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  display: "flex", flexDirection: "column", alignItems: "center",
                  justifyContent: "center", gap: 2, flex: 1, padding: "4px 0",
                  position: "relative",
                }}
              >
                {isActive && (
                  <span style={{
                    position: "absolute", top: -1, left: "50%",
                    transform: "translateX(-50%)",
                    width: 28, height: 2.5, borderRadius: "0 0 3px 3px",
                    background: `linear-gradient(90deg, ${theme.primary}, ${theme.accent})`,
                  }} />
                )}
                <span style={{
                  position: "relative", display: "flex", alignItems: "center",
                  justifyContent: "center", width: 34, height: 34, borderRadius: "50%",
                  background: isActive ? `${theme.lightPurple}55` : "transparent",
                }}>
                  <Icon active={isActive} />
                </span>
                <span style={{
                  fontSize: 10,
                  fontWeight: isActive ? 700 : 400,
                  color: isActive ? theme.primary : "#999",
                }}>{label}</span>
              </button>
            );
          })}
        </nav>
      </>
    );
  }

  /* ══ DESKTOP FOOTER ══ */
  return (
    <footer style={{
      background: theme.footerBg,
      borderTop: `1px solid ${theme.muted}`,
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
      marginTop: 40,
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 40px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1.4fr 1fr", gap: 48, marginBottom: 40 }}>

          {/* Col 1 */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 800, color: "#fff", letterSpacing: 1, margin: "0 0 14px" }}>ONLINE SHOPPING</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {["Shop","Women","Men","Perfume","Shoes","New Arrivals"].map(l => (
                <li key={l}>
                  <a href="#" style={{ fontSize: 13, color: theme.footerText, textDecoration: "none" }}
                    onMouseEnter={e => e.target.style.color = theme.primary}
                    onMouseLeave={e => e.target.style.color = theme.footerText}>{l}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2 */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 800, color: "#fff", letterSpacing: 1, margin: "0 0 14px" }}>CUSTOMER POLICIES</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {policies.map(item => (
                <li key={item.label}>
                  <Link to={item.path} style={{ fontSize: 13, color: theme.footerText, textDecoration: "none" }}
                    onMouseEnter={e => e.target.style.color = theme.primary}
                    onMouseLeave={e => e.target.style.color = theme.footerText}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 800, color: "#fff", letterSpacing: 1, margin: "0 0 14px" }}>KEEP IN TOUCH</h4>
            <div style={{ display: "flex", gap: 14 }}>
              <a href="https://www.instagram.com/thezuro22?igsh=aWgyZTU1MjgzM3V0" target="_blank" rel="noopener noreferrer"
                style={{ width: 36, height: 36, borderRadius: "50%", background: "#fff", border: `1px solid ${theme.muted}`, display: "flex", alignItems: "center", justifyContent: "center", color: "#888", textDecoration: "none", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#E1306C"; e.currentTarget.style.borderColor = "#E1306C"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "#888"; e.currentTarget.style.borderColor = theme.muted; }}>
                <IgIcon />
              </a>
            </div>
          </div>

          {/* Col 4 */}
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", border: `2px solid ${theme.muted}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 20 }}>✅</div>
              <p style={{ margin: 0, fontSize: 13, color: theme.footerText, lineHeight: 1.5 }}>
                <strong>100% ORIGINAL</strong> guarantee for all products at thezuro.com
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 8, border: `2px solid ${theme.muted}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 13, fontWeight: 800, color: theme.footerText }}>14</div>
              <p style={{ margin: 0, fontSize: 13, color: theme.footerText, lineHeight: 1.5 }}>
                <strong>Return within 14 days</strong> of receiving your order
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: `1px solid ${theme.muted}`, paddingTop: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, color: theme.footerText }}>
              © {new Date().getFullYear()} <strong style={{ color: theme.primary }}>The Zuro</strong>. All rights reserved.
            </span>
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            {[{ label: "Privacy Policy", path: "/privacy-policy" }, { label: "Terms of Use", path: "/terms" }].map(item => (
              <Link key={item.label} to={item.path}
                style={{ fontSize: 12, color: theme.footerText, textDecoration: "none" }}
                onMouseEnter={e => e.target.style.color = theme.primary}
                onMouseLeave={e => e.target.style.color = theme.footerText}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}