import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import theme from "./theme";
import { API_URL } from "../config/api";

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const OrderIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);
const WishlistIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const AddressIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const PaymentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);
const LogoutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);
const NotifIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const EmptyBagIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

export default function ProfilePage() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");
  const [editMode,  setEditMode]  = useState(false);
  const [user,      setUser]      = useState(null);
  const [form,      setForm]      = useState({});
  const [loading,   setLoading]   = useState(true);
  const [bagItems,  setBagItems]  = useState([]);
  const [stats,     setStats]     = useState({ totalOrders: 0, wishlistItems: 0, rewardPoints: 0 });
  const [isMobile, setIsMobile]   = useState(window.innerWidth <= 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [profileRes, statsRes, bagRes] = await Promise.all([
          fetch(`${API_URL}/user/profile`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/user/stats`,   { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/bag`,          { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const profileData = await profileRes.json();
        const statsData   = await statsRes.json();
        const bagData     = await bagRes.json();

        if (profileRes.ok) { setUser(profileData); setForm(profileData); }
        if (statsRes.ok)   { setStats(statsData); }
        if (bagRes.ok)     { setBagItems(Array.isArray(bagData) ? bagData : bagData?.items || []); }

      } catch (err) {
        console.log("LOAD ERROR:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/user/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) { setUser(data); setEditMode(false); alert("Profile updated!"); }
      else { alert(data.message); }
    } catch (err) { console.log(err); }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menuItems = [
    {
      icon: <OrderIcon />,
      label: "My Orders",
      sub: `${bagItems.length} items in bag`,
      onClick: () => setActiveTab("orders"),
    },
    {
      icon: <WishlistIcon />,
      label: "My Wishlist",
      sub: `${stats.wishlistItems} saved items`,
      onClick: () => navigate("/wishlist"),
    },
    {
      icon: <AddressIcon />,
      label: "Saved Addresses",
      sub: "Manage your addresses",
      onClick: () => { setActiveTab("settings"); setEditMode(true); },
    },
    {
      icon: <PaymentIcon />,
      label: "Payment Methods",
      sub: "Cards, UPI, Wallets",
      onClick: () => navigate("/checkout", { state: { startStep: 2 } }),
    },
  ];

  const tabs = ["overview", "orders", "settings"];

  if (loading || !user) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: theme.bg, fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", border: `4px solid ${theme.lightPurple}`, borderTop: `4px solid ${theme.primary}`, animation: "spin 0.9s linear infinite", margin: "0 auto 16px" }} />
          <div style={{ fontSize: 15, color: theme.primary, fontWeight: 700 }}>Loading your profile...</div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>

      {/* ── HERO BANNER ── */}
      <div style={{ background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.accent} 100%)`, padding: "40px 24px 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
        <div style={{ position: "absolute", bottom: -60, left: -20, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />

        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1 }}>

          {/* Back button */}
          <button onClick={() => navigate("/home")}
            style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 8, color: "#000", padding: "6px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", marginBottom: 20 }}>
            <BackIcon /> Back to Home
          </button>

          {/* ── Profile row ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>

            {/* Avatar */}
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgb(165,139,59)", border: "3px solid rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
              {(user.name || "U").split(" ").map(n => n[0]).join("").toUpperCase()}
            </div>

            {/* Name / email */}
            <div style={{ flex: 1 }}>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#fff" }}>{user.name}</h1>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: "rgba(255,255,255,0.8)" }}>{user.email}</p>
              <span style={{ display: "inline-block", marginTop: 8, background: "rgba(255,255,255,0.2)", color: "#000", fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.3)" }}>
                ⭐ Zuro Insider
              </span>
            </div>

            {/* ── Edit + Logout — right aligned, same row ── */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
              <button
                onClick={() => { setActiveTab("settings"); setEditMode(true); }}
                style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.4)", borderRadius: 8, color: "#000", padding: "8px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, fontFamily: "inherit" }}>
                <EditIcon /> Edit Profile
              </button>

              <button
                onClick={handleLogout}
                style={{ background: theme.primary, border: `1px solid ${theme.primary}`, borderRadius: 8, color: "#000", padding: "8px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, fontFamily: "inherit" }}>
                <LogoutIcon /> Logout
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* ── STATS BAR ── */}
      <div style={{ maxWidth: 900, margin: "-28px auto 0", padding: "0 24px", position: "relative", zIndex: 2 }}>
        <div style={{ background: theme.white, borderRadius: 16, boxShadow: "0 4px 24px rgba(148,0,211,0.10)", display: "grid", gridTemplateColumns: "repeat(3,1fr)", overflow: "hidden" }}>
          {[
            { label: "Bag Items",     value: bagItems.length,      tab: "orders"   },
            { label: "Wishlist Items", value: stats.wishlistItems,  tab: "overview" },
            { label: "Reward Points",  value: stats.rewardPoints,   tab: null       },
          ].map((s, i) => (
            <div key={s.label} onClick={() => s.tab && setActiveTab(s.tab)}
              style={{ padding: "20px", textAlign: "center", borderRight: i < 2 ? `1px solid ${theme.lightPurple}` : "none", cursor: s.tab ? "pointer" : "default" }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: theme.primary }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TABS ── */}
      <div style={{ maxWidth: 900, margin: "24px auto 0", padding: "0 24px" }}>
        <div style={{ display: "flex", gap: 4, background: theme.white, borderRadius: 12, padding: 4, boxShadow: "0 2px 12px rgba(148,0,211,0.07)" }}>
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ flex: 1, border: "none", cursor: "pointer", borderRadius: 10, padding: "10px 0", fontSize: 13, fontWeight: 700, textTransform: "capitalize", fontFamily: "inherit", background: activeTab === tab ? "#000" : "none", color: activeTab === tab ? "rgb(201,168,76)" : "#888", transition: "all 0.2s ease" }}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── TAB CONTENT ── */}
      <div style={{ maxWidth: 900, margin: "20px auto 40px", padding: "0 24px" }}>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {menuItems.map(({ icon, label, sub, onClick }) => (
                <div key={label} onClick={onClick}
                  style={{ background: theme.white, borderRadius: 12, padding: "16px 18px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", boxShadow: "0 2px 10px rgba(148,0,211,0.06)", border: `1px solid ${theme.lightPurple}44`, transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = theme.accent; e.currentTarget.style.transform = "translateX(4px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = `${theme.lightPurple}44`; e.currentTarget.style.transform = "translateX(0)"; }}>
                  <span style={{ color: theme.primary, display: "flex" }}>{icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: theme.dark }}>{label}</div>
                    <div style={{ fontSize: 12, color: "#aaa", marginTop: 2 }}>{sub}</div>
                  </div>
                  <span style={{ color: theme.muted }}><ChevronRight /></span>
                </div>
              ))}
            </div>

            {/* Recent Bag Items */}
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 800, color: theme.dark, margin: "0 0 12px", letterSpacing: 0.5 }}>MY BAG</h3>
              {bagItems.length === 0 ? (
                <div style={{ background: theme.white, borderRadius: 12, padding: "40px 20px", textAlign: "center", boxShadow: "0 2px 10px rgba(148,0,211,0.06)", border: `1px solid ${theme.lightPurple}44` }}>
                  <EmptyBagIcon />
                  <p style={{ color: "#aaa", fontSize: 13, marginTop: 12 }}>Your bag is empty</p>
                  <button onClick={() => navigate("/home")}
                    style={{ marginTop: 12, padding: "8px 20px", background: "#000", color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                    Shop Now
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {bagItems.slice(0, 3).map((item, i) => {
                    const product = item.product || item;
                    const imgUrl  = product?.media?.find(m => m.is_primary)?.media_url || product?.media?.[0]?.media_url;
                    return (
                      <div key={i} style={{ background: theme.white, borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 2px 10px rgba(148,0,211,0.06)", border: `1px solid ${theme.lightPurple}44` }}>
                        <div style={{ width: 44, height: 44, borderRadius: 10, background: "#f5f4f0", overflow: "hidden", flexShrink: 0 }}>
                          {imgUrl
                            ? <img src={imgUrl} alt={product?.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🛍️</div>
                          }
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: theme.dark, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{product?.title || "Product"}</div>
                          <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>Qty: {item.quantity || 1} · ₹{(product?.sale_price ?? product?.base_price ?? 0).toLocaleString()}</div>
                        </div>
                      </div>
                    );
                  })}
                  <button onClick={() => navigate("/bag")}
                    style={{ marginTop: 4, width: "100%", padding: "10px", background: "none", border: `1px solid ${theme.lightPurple}`, borderRadius: 10, color: theme.primary, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                    View Bag →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ORDERS — shows bag items as current orders */}
        {activeTab === "orders" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: theme.dark, margin: "0 0 4px", letterSpacing: 0.5 }}>MY BAG ITEMS</h3>

            {bagItems.length === 0 ? (
              <div style={{ background: theme.white, borderRadius: 16, padding: "60px 20px", textAlign: "center", boxShadow: "0 2px 10px rgba(148,0,211,0.06)" }}>
                <EmptyBagIcon />
                <p style={{ color: "#aaa", fontSize: 15, marginTop: 16, marginBottom: 6 }}>Your bag is empty</p>
                <p style={{ color: "#ccc", fontSize: 13, marginBottom: 20 }}>Start shopping to see items here</p>
                <button onClick={() => navigate("/home")}
                  style={{ padding: "11px 28px", background: "#000", color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", letterSpacing: 1 }}>
                  Browse Products
                </button>
              </div>
            ) : (
              bagItems.map((item, i) => {
                const product = item.product || item;
                const imgUrl  = product?.media?.find(m => m.is_primary)?.media_url || product?.media?.[0]?.media_url;
                return (
                  <div key={i} style={{ background: theme.white, borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 2px 10px rgba(148,0,211,0.06)", border: `1px solid ${theme.lightPurple}44` }}>
                    <div style={{ width: 56, height: 56, borderRadius: 10, background: "#f5f4f0", overflow: "hidden", flexShrink: 0 }}>
                      {imgUrl
                        ? <img src={imgUrl} alt={product?.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>🛍️</div>
                      }
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: theme.dark }}>{product?.title || "Product"}</div>
                      <div style={{ fontSize: 12, color: "#aaa", marginTop: 3 }}>Brand: {product?.brand || "—"} · Qty: {item.quantity || 1}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: theme.dark }}>₹{(product?.sale_price ?? product?.base_price ?? 0).toLocaleString()}</div>
                      <button onClick={() => navigate("/bag")}
                        style={{ marginTop: 8, fontSize: 11, border: `1px solid ${theme.lightPurple}`, background: "none", borderRadius: 6, padding: "4px 12px", cursor: "pointer", color: theme.primary, fontWeight: 600, fontFamily: "inherit" }}>
                        View Bag
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* SETTINGS */}
        {activeTab === "settings" && (
          <div style={{ background: theme.white, borderRadius: 16, padding: 28, boxShadow: "0 2px 16px rgba(148,0,211,0.08)" }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: theme.dark, margin: "0 0 20px", letterSpacing: 0.5 }}>PERSONAL INFORMATION</h3>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
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
                    <input value={form[key] ?? ""} onChange={e => setForm({ ...form, [key]: e.target.value })}
                      style={{ width: "100%", border: `1.5px solid ${theme.lightPurple}`, borderRadius: 8, padding: "10px 12px", fontSize: 14, outline: "none", fontFamily: "inherit", color: theme.dark, boxSizing: "border-box" }}
                      onFocus={e => e.target.style.borderColor = theme.primary}
                      onBlur={e  => e.target.style.borderColor = theme.lightPurple} />
                  ) : (
                    <div style={{ fontSize: 14, color: theme.dark, padding: "10px 0", borderBottom: `1px solid ${theme.lightPurple}44` }}>
                      {user[key] ?? "—"}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {editMode ? (
              <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                <button onClick={handleSave}
                  style={{ background: "#000", color: "#fff", border: "none", borderRadius: 10, padding: "12px 32px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
                  onMouseEnter={e => e.target.style.background = "#222"}
                  onMouseLeave={e => e.target.style.background = "#000"}>
                  Save Changes
                </button>
                <button onClick={() => { setEditMode(false); setForm({ ...user }); }}
                  style={{ background: "#fff", border: "1.5px solid #000", borderRadius: 10, padding: "12px 32px", fontSize: 14, fontWeight: 600, cursor: "pointer", color: "#000", fontFamily: "inherit" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#000"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#000"; }}>
                  Cancel
                </button>
              </div>
            ) : null}
          </div>
        )}

      </div>
    </div>
  );
}