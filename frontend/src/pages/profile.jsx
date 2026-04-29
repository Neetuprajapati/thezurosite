import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import theme from "./theme";

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const OrderIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);
const WishlistIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const AddressIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const PaymentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);
const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const NotifIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);
const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

const orders = [
  { id: "#ZR00123", item: "Men's Casual Shirt", status: "Delivered",  date: "Mar 28, 2026", color: "#22c55e", bg: "#f0fdf4", img: "👕" },
  { id: "#ZR00118", item: "Women's Palazzo",    status: "In Transit", date: "Apr 02, 2026", color: "#f59e0b", bg: "#fffbeb", img: "👗" },
  { id: "#ZR00110", item: "Wireless Earbuds",   status: "Processing", date: "Apr 04, 2026", color: "#9400D3", bg: "#f8f4ff", img: "🎧" },
];

export default function ProfilePage() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");
  const [editMode, setEditMode]   = useState(false);
  const [user, setUser]           = useState(null);
  const [form, setForm]           = useState({});
  const [loading, setLoading]     = useState(true);

  // ── Fetch profile on mount ─────────────────────────────────
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setUser(data);
          setForm(data);
        } else {
          console.log(data.message);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // ── Save edited profile ────────────────────────────────────
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        setEditMode(false);
        alert("✅ Profile updated");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ── Menu items ─────────────────────────────────────────────
  const menuItems = [
    { icon: <OrderIcon />,    label: "My Orders",       sub: "Track, return or buy again", tab: "orders"   },
    { icon: <WishlistIcon />, label: "My Wishlist",      sub: "12 saved items",            tab: "overview" },
    { icon: <AddressIcon />,  label: "Saved Addresses",  sub: "2 addresses saved",         tab: "settings" },
    { icon: <PaymentIcon />,  label: "Payment Methods",  sub: "Cards, UPI, Wallets",       tab: "settings" },
    { icon: <NotifIcon />,    label: "Notifications",    sub: "Manage your alerts",        tab: "settings" },
  ];

  const tabs = ["overview", "orders", "settings"];

  // ── ✅ LOADING GUARD — API finish hone tak safe screen ─────
  if (loading || !user) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: theme.bg,
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
      }}>
        <div style={{ textAlign: "center" }}>
          {/* Animated spinner ring */}
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            border: `4px solid ${theme.lightPurple}`,
            borderTop: `4px solid ${theme.primary}`,
            animation: "spin 0.9s linear infinite",
            margin: "0 auto 16px",
          }} />
          <div style={{ fontSize: 15, color: theme.primary, fontWeight: 700 }}>
            Loading your profile...
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  // ── Main render (user is guaranteed non-null here) ─────────
  return (
    <div style={{ minHeight: "100vh", background: theme.bg, fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>

      {/* ── Hero Banner ── */}
      <div style={{
        background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.accent} 100%)`,
        padding: "40px 24px 80px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
        <div style={{ position: "absolute", bottom: -60, left: -20, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />

        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1 }}>

          {/* Back Button */}
          <button
            onClick={() => navigate("/home")}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: 8,
              color: "#000",
              padding: "6px 14px", fontSize: 13, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit", marginBottom: 20,
            }}
          >
            <BackIcon /> Back to Home
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>

            {/* Avatar initials */}
            <div style={{
              width: 80, height: 80, borderRadius: "50%",
              background: "rgba(255,255,255,0.25)",
              border: "3px solid rgba(255,255,255,0.6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 32, fontWeight: 700, color: "#000", flexShrink: 0,
            }}>
              {(user.name || "U").split(" ").map(n => n[0]).join("").toUpperCase()}
            </div>

            <div>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#fff" }}>{user.name}</h1>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: "rgba(255,255,255,0.8)" }}>{user.email}</p>
              <span style={{
                display: "inline-block", marginTop: 8,
                background: "rgba(255,255,255,0.2)", color: "#000",
                fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 20,
                border: "1px solid rgba(255,255,255,0.3)",
              }}>⭐ Zuro Insider</span>
            </div>

            <button
              onClick={() => { setActiveTab("settings"); setEditMode(true); }}
              style={{
                marginLeft: "auto",
                background: "rgba(255,255,255,0.2)",
                border: "1px solid rgba(255,255,255,0.4)", borderRadius: 8,
                color: "#000", padding: "8px 16px", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6,
                fontSize: 13, fontWeight: 600, fontFamily: "inherit",
              }}>
              <EditIcon /> Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* ── Stats Bar ── */}
      <div style={{ maxWidth: 900, margin: "-28px auto 0", padding: "0 24px", position: "relative", zIndex: 2 }}>
        <div style={{
          background: theme.white, borderRadius: 16,
          boxShadow: "0 4px 24px rgba(148,0,211,0.10)",
          display: "grid", gridTemplateColumns: "repeat(3,1fr)",
          overflow: "hidden",
        }}>
          {[
            { label: "Total Orders",   value: "24",  tab: "orders"   },
            { label: "Wishlist Items", value: "12",  tab: "overview" },
            { label: "Reward Points",  value: "840", tab: null       },
          ].map((s, i) => (
            <div key={s.label}
              onClick={() => s.tab && setActiveTab(s.tab)}
              style={{
                padding: "20px", textAlign: "center",
                borderRight: i < 2 ? `1px solid ${theme.lightPurple}` : "none",
                cursor: s.tab ? "pointer" : "default",
              }}
            >
              <div style={{ fontSize: 26, fontWeight: 800, color: theme.primary }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ maxWidth: 900, margin: "24px auto 0", padding: "0 24px" }}>
        <div style={{ display: "flex", gap: 4, background: theme.white, borderRadius: 12, padding: 4, boxShadow: "0 2px 12px rgba(148,0,211,0.07)" }}>
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              flex: 1, border: "none", cursor: "pointer", borderRadius: 10,
              padding: "10px 0", fontSize: 13, fontWeight: 700,
              textTransform: "capitalize", fontFamily: "inherit",
              background: activeTab === tab ? `linear-gradient(135deg, ${theme.primary}, ${theme.accent})` : "none",
              color: activeTab === tab ? "#fff" : "#888",
              transition: "all 0.2s",
            }}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div style={{ maxWidth: 900, margin: "20px auto 40px", padding: "0 24px" }}>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {menuItems.map(({ icon, label, sub, tab }) => (
                <div key={label}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    background: theme.white, borderRadius: 12, padding: "16px 18px",
                    display: "flex", alignItems: "center", gap: 14, cursor: "pointer",
                    boxShadow: "0 2px 10px rgba(148,0,211,0.06)",
                    border: `1px solid ${theme.lightPurple}44`,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = theme.accent; e.currentTarget.style.transform = "translateX(4px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = `${theme.lightPurple}44`; e.currentTarget.style.transform = "translateX(0)"; }}
                >
                  <span style={{ color: theme.primary, display: "flex" }}>{icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: theme.dark }}>{label}</div>
                    <div style={{ fontSize: 12, color: "#aaa", marginTop: 2 }}>{sub}</div>
                  </div>
                  <span style={{ color: theme.muted }}><ChevronRight /></span>
                </div>
              ))}
            </div>

            {/* Recent Orders */}
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 800, color: theme.dark, margin: "0 0 12px", letterSpacing: 0.5 }}>RECENT ORDERS</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {orders.map(o => (
                  <div key={o.id} style={{
                    background: theme.white, borderRadius: 12, padding: "14px 16px",
                    display: "flex", alignItems: "center", gap: 14,
                    boxShadow: "0 2px 10px rgba(148,0,211,0.06)",
                    border: `1px solid ${theme.lightPurple}44`,
                  }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: o.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{o.img}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: theme.dark }}>{o.item}</div>
                      <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{o.id} · {o.date}</div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: o.color, background: o.bg, padding: "3px 10px", borderRadius: 20 }}>{o.status}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setActiveTab("orders")}
                style={{
                  marginTop: 12, width: "100%", padding: "10px",
                  background: "none", border: `1px solid ${theme.lightPurple}`,
                  borderRadius: 10, color: theme.primary, fontWeight: 700,
                  fontSize: 13, cursor: "pointer", fontFamily: "inherit",
                }}
              >
                View All Orders →
              </button>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === "orders" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: theme.dark, margin: "0 0 4px", letterSpacing: 0.5 }}>ALL ORDERS</h3>
            {[...orders, ...orders].map((o, i) => (
              <div key={i} style={{
                background: theme.white, borderRadius: 12, padding: "16px 20px",
                display: "flex", alignItems: "center", gap: 16,
                boxShadow: "0 2px 10px rgba(148,0,211,0.06)",
                border: `1px solid ${theme.lightPurple}44`,
              }}>
                <div style={{ width: 52, height: 52, borderRadius: 10, background: o.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>{o.img}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: theme.dark }}>{o.item}</div>
                  <div style={{ fontSize: 12, color: "#aaa", marginTop: 3 }}>Order {o.id} · {o.date}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: o.color, background: o.bg, padding: "4px 12px", borderRadius: 20 }}>{o.status}</span>
                  <div style={{ marginTop: 8, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <button style={{ fontSize: 11, border: `1px solid ${theme.lightPurple}`, background: "none", borderRadius: 6, padding: "4px 12px", cursor: "pointer", color: theme.primary, fontWeight: 600, fontFamily: "inherit" }}>Track</button>
                    <button style={{ fontSize: 11, border: `1px solid ${theme.lightPurple}`, background: "none", borderRadius: 6, padding: "4px 12px", cursor: "pointer", color: "#888", fontFamily: "inherit" }}>Return</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === "settings" && (
          <div style={{ background: theme.white, borderRadius: 16, padding: 28, boxShadow: "0 2px 16px rgba(148,0,211,0.08)" }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: theme.dark, margin: "0 0 20px", letterSpacing: 0.5 }}>PERSONAL INFORMATION</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { label: "Full Name",     key: "name"   },
                { label: "Email Address", key: "email"  },
                { label: "Phone Number",  key: "phone"  },
                { label: "Gender",        key: "gender" },
                { label: "Date of Birth", key: "dob"    },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label style={{ fontSize: 12, color: "#aaa", fontWeight: 600, display: "block", marginBottom: 6 }}>{label}</label>
                  {editMode ? (
                    <input
                      value={form[key] ?? ""}
                      onChange={e => setForm({ ...form, [key]: e.target.value })}
                      style={{
                        width: "100%", border: `1.5px solid ${theme.lightPurple}`, borderRadius: 8,
                        padding: "10px 12px", fontSize: 14, outline: "none", fontFamily: "inherit",
                        color: theme.dark, boxSizing: "border-box", transition: "border-color 0.2s",
                      }}
                      onFocus={e => e.target.style.borderColor = theme.primary}
                      onBlur={e => e.target.style.borderColor = theme.lightPurple}
                    />
                  ) : (
                    <div style={{ fontSize: 14, color: theme.dark, padding: "10px 0", borderBottom: `1px solid ${theme.lightPurple}44` }}>
                      {user[key] ?? "—"}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {editMode && (
              <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                <button onClick={handleSave} style={{
                  background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
                  color: "#fff", border: "none", borderRadius: 10,
                  padding: "12px 32px", fontSize: 14, fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit",
                }}>Save Changes</button>
                <button onClick={() => { setEditMode(false); setForm({ ...user }); }} style={{
                  background: "none", border: `1.5px solid ${theme.muted}`, borderRadius: 10,
                  padding: "12px 32px", fontSize: 14, fontWeight: 600,
                  cursor: "pointer", color: "#888", fontFamily: "inherit",
                }}>Cancel</button>
              </div>
            )}

            {!editMode && (
              <button onClick={() => setEditMode(true)} style={{
                marginTop: 24, display: "flex", alignItems: "center", gap: 8,
                background: `${theme.lightPurple}55`, border: `1px solid ${theme.lightPurple}`,
                borderRadius: 10, padding: "10px 24px", fontSize: 13, fontWeight: 700,
                cursor: "pointer", color: theme.primary, fontFamily: "inherit",
              }}>
                <EditIcon /> Edit Information
              </button>
            )}

            {/* Logout */}
            <div style={{ marginTop: 32, paddingTop: 24, borderTop: `1px solid ${theme.lightPurple}44` }}>
              <button
                onClick={() => navigate("/login")}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  background: "#fff0f0", border: "1px solid #fecaca",
                  borderRadius: 10, padding: "12px 24px", fontSize: 13, fontWeight: 700,
                  cursor: "pointer", color: "#ef4444", fontFamily: "inherit",
                }}>
                <LogoutIcon /> Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}