import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import theme from "./theme";
import logo from "../assest/logo/thezurologo.png";  


const API = "http://localhost:5000/api";

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const UserIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const HeartIcon = ({ filled }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? "rgb(237,128,233)" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const BagIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);
const ChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const ZuroLogo = ({ onClick }) => (
  <div
    onClick={onClick}
    style={{
      display: "flex",
      alignItems: "center",
      cursor: "pointer"
    }}
  >
    <img
      src={logo}
      alt="TheZuro"
      style={{
        height: 42,
        width: "auto",
        objectFit: "contain"
      }}
    />
  </div>
);


// const theme = {
//   primary: "#9400D3",
//   accent: "#ED80E9",
//   lightPurple: "#D3D3FF",
//   muted: "#D8BFD8",
//   white: "#ffffff",
//   dark: "#1a1a2e",
// };

// ── Badge Component ──────────────────────────────────────────
function Badge({ count, color }) {
  if (!count || count === 0) return null;
  return (
    <span style={{
      position: "absolute", top: -6, right: -8,
      background: color || `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
      color: "#fff", fontSize: 10, fontWeight: 700,
      minWidth: 17, height: 17, borderRadius: "50%",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "0 3px",
      boxShadow: "0 2px 6px rgba(148,0,211,0.4)",
      animation: "popIn 0.25s cubic-bezier(0.34,1.56,0.64,1)",
    }}>
      {count > 99 ? "99+" : count}
    </span>
  );
}



const megaMenus = {
  MEN: {
    promo: "🎉 New Arrivals in Men's Fashion — Up to 50% Off!",
    sections: [
      { category: "Topwear", icon: "👕", items: ["T-Shirts", "Casual Shirts", "Formal Shirts", "Sweatshirts", "Jackets & Coats", "Suits & Blazers"] },
      { category: "Bottomwear", icon: "👖", items: ["Jeans", "Casual Trousers", "Formal Trousers", "Shorts", "Track Pants", "Joggers"] },
      { category: "Footwear", icon: "👟", items: ["Casual Shoes", "Sports Shoes", "Formal Shoes", "Sandals & Floaters", "Flip Flops", "Boots"] },
      { category: "Fashion Accessory", icon: "🕶️", items: ["Watches", "Sunglasses", "Belts", "Wallets", "Caps & Hats", "Ties & Cufflinks"] },
    ],
  },
  WOMEN: {
    promo: "✨ Trending Women's Collection — Flat 40% Off on New Styles!",
    sections: [
      { category: "Topwear", icon: "👚", items: ["Kurtas & Suits", "Tops & Tees", "Blouses", "Sweatshirts", "Jackets", "Co-ord Sets"] },
      { category: "Bottomwear", icon: "👗", items: ["Sarees", "Lehengas", "Jeans", "Palazzos", "Skirts", "Trousers & Capris"] },
      { category: "Footwear", icon: "👠", items: ["Heels", "Flats", "Sneakers", "Sandals", "Boots", "Wedges"] },
      { category: "Fashion Accessory", icon: "👜", items: ["Handbags", "Earrings", "Necklaces", "Bangles & Bracelets", "Sunglasses", "Scarves & Stoles"] },
    ],
  },
  KIDS: {
    promo: "🧸 Kids' Carnival Sale — Buy 2 Get 1 Free on All Styles!",
    sections: [
      { category: "Topwear", icon: "🧒", items: ["T-Shirts", "Shirts", "Sweatshirts", "Dungarees", "Ethnic Wear", "Party Wear"] },
      { category: "Bottomwear", icon: "🩳", items: ["Jeans", "Trousers", "Shorts", "Track Pants", "Skirts", "Leggings"] },
      { category: "Footwear", icon: "👟", items: ["Casual Shoes", "Sports Shoes", "Sandals", "Flip Flops", "School Shoes", "Boots"] },
      { category: "Fashion Accessory", icon: "🎒", items: ["Backpacks", "Hair Accessories", "Caps & Hats", "Watches", "Belts", "Socks"] },
    ],
  },
  BEAUTY: {
    promo: "💄 Glow Up Sale — Up to 60% Off on Premium Beauty Brands!",
    sections: [
      { category: "Lip Care", icon: "💋", items: ["Lipstick", "Lip Gloss", "Lip Balm", "Lip Liner", "Lip Plumper", "Lip Tint"] },
      { category: "Jewellery", icon: "💍", items: ["Earrings", "Necklaces", "Rings", "Bangles", "Anklets", "Brooches"] },
      { category: "Skin Care", icon: "🧴", items: ["Moisturizers", "Serums", "Sunscreen", "Face Wash", "Toners", "Face Masks"] },
      { category: "Makeup", icon: "🎨", items: ["Foundation", "Mascara", "Eyeliner", "Blush", "Highlighter", "Concealer"] },
    ],
  },
};

const navItems = [
  { label: "MEN", hasDropdown: true },
  { label: "WOMEN", hasDropdown: true },
  { label: "KIDS", hasDropdown: true },
  { label: "HOME" },
  { label: "BEAUTY", hasDropdown: true },
];

export default function ZuroHeader() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [hoveredNav, setHoveredNav] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [mobileSearch, setMobileSearch] = useState("");
  const hideTimer = useRef(null);

  // ── Dynamic counts ──────────────────────────────────────────
  const [bagCount, setBagCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const [user, setUser] = useState(null);

  // ── On mount: load user & fetch counts ─────────────────────
  useEffect(() => {
    const stored = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (stored && token) {
      setUser(JSON.parse(stored));
      fetchCounts(token);
    }
  }, []);

  // ── Expose global refresh so other pages can call it ───────
  // e.g. after adding to bag: window.refreshHeaderCounts()
  useEffect(() => {
    window.refreshHeaderCounts = () => {
      const token = localStorage.getItem("token");
      if (token) fetchCounts(token);
    };
    return () => { delete window.refreshHeaderCounts; };
  }, []);

  const fetchCounts = async (token) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [bagRes, wishRes] = await Promise.all([
        fetch(`${API}/bag/count`, { headers }),
        fetch(`${API}/wishlist/count`, { headers }),
      ]);

      if (bagRes.ok) {
        const bagData = await bagRes.json();
        setBagCount(bagData.count ?? 0);
      }
      if (wishRes.ok) {
        const wishData = await wishRes.json();
        setWishlistCount(wishData.count ?? 0);
      }
    } catch (err) {
      console.log("Count fetch error:", err);
    }
  };

  // bag function here  
  const addToCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/bag/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId })
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Added to Bag");
        window.refreshHeaderCounts(); // header update
      } else {
        alert(data.message || "❌ Failed");
      }
    } catch (err) {
      console.log(err);
      alert("Server error");
    }
  };
  // ── Guard: only profile needs login check ──────────────────
  const guardedNavigate = (path) => {
    navigate(path); // always navigate; individual pages handle their own auth
  };

  const openDropdown = (label) => { clearTimeout(hideTimer.current); setOpenMenu(label); };
  const closeDropdown = () => { hideTimer.current = setTimeout(() => setOpenMenu(null), 150); };
  const closeMobile = () => { setMobileOpen(false); setMobileExpanded(null); };

  return (
    <>
      <style>{`
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }
        @keyframes popIn {
          from { transform: scale(0.5); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
        .desktop-nav { display: flex; }
        .mobile-menu-btn { display: none; }
        .mobile-search-bar { display: none; }

        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .desktop-search { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .mobile-search-bar { display: flex !important; }
          .desktop-icons span { display: none; }
        }
      `}</style>

      <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", position: "relative" }}>

        {/* ── MAIN HEADER BAR ── */}
        <div style={{
          background: theme.white,
          borderBottom: `2px solid ${theme.lightPurple}`,
          padding: "0 16px",
          boxShadow: `0 2px 12px ${theme.lightPurple}88`,
          position: "sticky", top: 0, zIndex: 9999,
        }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", height: 64, gap: 16 }}>

            {/* Mobile: Hamburger */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileOpen(true)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: theme.primary, display: "none", alignItems: "center" }}
            >
              <MenuIcon />
            </button>

            {/* Logo */}
            <ZuroLogo onClick={() => navigate("/home")} />

            {/* Desktop Nav */}
            <nav className="desktop-nav" style={{ alignItems: "center", gap: 2 }}>
              {navItems.map((item) => {
                const isActive = activeNav === item.label;
                const isHovered = hoveredNav === item.label;
                const hasDD = item.hasDropdown;
                return (
                  <div
                    key={item.label}
                    onClick={() => { setActiveNav(item.label); if (!hasDD) setOpenMenu(null); }}
                    onMouseEnter={() => { setHoveredNav(item.label); if (hasDD) openDropdown(item.label); else closeDropdown(); }}
                    onMouseLeave={() => { setHoveredNav(null); if (hasDD) closeDropdown(); }}
                    style={{
                      position: "relative", padding: "20px 12px", cursor: "pointer",
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                      background: isHovered && !isActive ? `${theme.lightPurple}55` : "transparent",
                      borderRadius: 6, transition: "background 0.2s",
                    }}
                  >
                    <span style={{
                      fontSize: 13, fontWeight: 700, letterSpacing: 0.5,
                      color: isActive ? theme.primary : theme.dark,
                      whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 4,
                    }}>
                      {item.label}
                      {hasDD && (
                        <span style={{
                          color: isActive ? theme.primary : theme.muted,
                          display: "flex", alignItems: "center",
                          transform: openMenu === item.label ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.2s",
                        }}>
                          <ChevronDown />
                        </span>
                      )}
                    </span>
                    {isActive && (
                      <div style={{
                        position: "absolute", bottom: 0, left: 12, right: 12, height: 3,
                        background: `linear-gradient(90deg, ${theme.primary}, ${theme.accent})`,
                        borderRadius: "3px 3px 0 0",
                      }} />
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Desktop Search */}
            <div className="desktop-search" style={{ flex: 1, maxWidth: 480 }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                background: `${theme.lightPurple}44`, borderRadius: 6, padding: "9px 16px",
                border: searchFocused ? `1.5px solid ${theme.primary}` : `1.5px solid ${theme.muted}`,
                transition: "border-color 0.2s",
              }}>
                <span style={{ color: theme.primary }}><SearchIcon /></span>
                <input
                  type="text"
                  placeholder="Search for products, brands and more"
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  style={{ border: "none", background: "transparent", outline: "none", fontSize: 14, color: theme.dark, width: "100%", fontFamily: "inherit" }}
                />
              </div>
            </div>

            {/* ── Right Icons ── */}
            <div className="desktop-icons" style={{ display: "flex", alignItems: "center", gap: 20, marginLeft: "auto" }}>

              {/* Profile */}
              <button
                onClick={() => guardedNavigate("/profile")}
                style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: 0, color: theme.primary }}
              >
                <div style={{ position: "relative" }}>
                  <UserIcon />
                  {/* Green dot if logged in */}
                  {user && (
                    <span style={{
                      position: "absolute", bottom: 0, right: -1,
                      width: 8, height: 8, borderRadius: "50%",
                      background: "#22c55e",
                      border: "1.5px solid #fff",
                    }} />
                  )}
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: theme.dark, letterSpacing: 0.3 }}>
                  {user ? user.full_name?.split(" ")[0] : "Profile"}
                </span>
              </button>

              {/* Wishlist */}
              {/* <button onClick={() => addToWishlist(product.id)}
         
                style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: 0, color: theme.accent, position: "relative" }}
              >
                
                <div style={{ position: "relative" }}>
                  <HeartIcon filled={wishlistCount > 0} />
                  <Badge count={wishlistCount} color={`linear-gradient(135deg, #ff4d7d, #ff80ab)`} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: theme.dark, letterSpacing: 0.3 }}>Wishlist</span>
              </button> */}
              <button
                onClick={() => navigate("/wishlist")}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                  padding: 0,
                  color: theme.accent,
                  position: "relative"
                }}
              >
                <div style={{ position: "relative" }}>
                  <HeartIcon filled={wishlistCount > 0} />
                  <Badge count={wishlistCount} color={`linear-gradient(135deg, #ff4d7d, #ff80ab)`} />
                </div>

                <span style={{ fontSize: 11, fontWeight: 600, color: theme.dark }}>
                  Wishlist
                </span>
              </button>

              {/* Bag */}
              {/* <button
                onClick={() => addToCart(product.id)}
                style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: 0, position: "relative", color: theme.primary }}
              >
                <div style={{ position: "relative" }}>
                  <BagIcon />
                  <Badge count={bagCount} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: theme.dark, letterSpacing: 0.3 }}>Bag</span>
              </button> */}

              {/* Bag */}
              {/* Bag */}
              {/* Bag */}
              <button
                onClick={() => navigate("/bag")}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                  padding: 0,
                  position: "relative",
                  color: theme.primary
                }}
              >
                <div style={{ position: "relative" }}>
                  <BagIcon />
                  <Badge count={bagCount} />
                </div>

                <span style={{ fontSize: 11, fontWeight: 600, color: theme.dark }}>
                  Bag
                </span>
              </button>

            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="mobile-search-bar" style={{
            display: "none", padding: "8px 0 10px",
            alignItems: "center", gap: 10,
            background: `${theme.lightPurple}44`, borderRadius: 8,
            border: `1.5px solid ${theme.muted}`, margin: "0 0 10px",
          }}>
            <span style={{ color: theme.primary, paddingLeft: 12 }}><SearchIcon /></span>
            <input
              type="text"
              placeholder="Search products, brands..."
              value={mobileSearch}
              onChange={e => setMobileSearch(e.target.value)}
              style={{ border: "none", background: "transparent", outline: "none", fontSize: 14, color: theme.dark, width: "100%", fontFamily: "inherit" }}
            />
          </div>
        </div>

        {/* ── DESKTOP MEGA DROPDOWN ── */}
        {openMenu && megaMenus[openMenu] && (
          <div
            onMouseEnter={() => openDropdown(openMenu)}
            onMouseLeave={closeDropdown}
            style={{
              position: "fixed", top: 64, left: 0, right: 0,
              // background: theme.white,
              borderTop: `3px solid ${theme.primary}`,
              borderBottom: `1px solid ${theme.lightPurple}`,
              boxShadow: `0 10px 40px rgba(148,0,211,0.15)`,
              zIndex: 998,
              background: "#ffffff",
              padding: "28px 48px 32px",
              animation: "fadeSlideDown 0.18s ease",
            }}
          >
            <div style={{ maxWidth: 1280, margin: "0 auto" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32 }}>
                {megaMenus[openMenu].sections.map((section) => (
                  <div key={section.category}>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 8,
                      marginBottom: 14, paddingBottom: 10,
                      borderBottom: `2px solid ${theme.lightPurple}`,
                    }}>
                      <span style={{ fontSize: 20 }}>{section.icon}</span>
                      <span style={{ fontSize: 13, fontWeight: 800, color: theme.primary, letterSpacing: 1, textTransform: "uppercase" }}>
                        {section.category}
                      </span>
                    </div>
                    <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                      {section.items.map((item) => (
                        <li key={item}
                          onMouseEnter={() => setHoveredItem(item)}
                          onMouseLeave={() => setHoveredItem(null)}
                          style={{
                            fontSize: 13, padding: "8px 12px", borderRadius: 6, cursor: "pointer",
                            color: hoveredItem === item ? theme.primary : "#555",
                            background: hoveredItem === item ? `${theme.lightPurple}55` : "transparent",
                            fontWeight: hoveredItem === item ? 600 : 400,
                            borderLeft: hoveredItem === item ? `3px solid ${theme.accent}` : "3px solid transparent",
                            transition: "all 0.15s ease",
                          }}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div style={{
                marginTop: 24, padding: "14px 20px",
                background: `linear-gradient(135deg, ${theme.lightPurple}66, ${theme.muted}44)`,
                borderRadius: 10,
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <span style={{ fontSize: 13, color: theme.primary, fontWeight: 600 }}>
                  {megaMenus[openMenu].promo}
                </span>
                {/* <button style={{
                  background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
                  color: "#fff", border: "none", borderRadius: 20,
                  padding: "7px 20px", fontSize: 12, fontWeight: 700,
                  cursor: "pointer", letterSpacing: 0.5,
                }}>
                  Shop Now
                </button> */}
              </div>
            </div>
          </div>
        )}

        {/* ── MOBILE DRAWER OVERLAY ── */}
        {mobileOpen && (
          <div onClick={closeMobile} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000 }} />
        )}

        {/* ── MOBILE DRAWER ── */}
        <div style={{
          position: "fixed", top: 0, left: 0, bottom: 0,
          width: 300, background: theme.white,
          zIndex: 1001,
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease",
          overflowY: "auto",
          boxShadow: "4px 0 24px rgba(148,0,211,0.15)",
        }}>

          {/* Drawer Header */}
          <div style={{
            background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
            padding: "20px 16px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>TheZuro</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", marginTop: 2 }}>
                {user ? `Hello, ${user.full_name?.split(" ")[0]} 👋` : "India's fastest growing fashion"}
              </div>
            </div>
            <button onClick={closeMobile} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 8, padding: 8, cursor: "pointer", color: "#fff", display: "flex" }}>
              <CloseIcon />
            </button>
          </div>

          {/* Mobile Search */}
          <div style={{ padding: "12px 16px", borderBottom: `1px solid ${theme.lightPurple}` }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: `${theme.lightPurple}44`, borderRadius: 8, padding: "9px 12px",
              border: `1.5px solid ${theme.lightPurple}`,
            }}>
              <span style={{ color: theme.primary }}><SearchIcon /></span>
              <input type="text" placeholder="Search products..." style={{ border: "none", background: "transparent", outline: "none", fontSize: 14, color: theme.dark, width: "100%", fontFamily: "inherit" }} />
            </div>
          </div>

          {/* Mobile Nav Items */}
          <div style={{ padding: "8px 0" }}>
            {navItems.map((item) => (
              <div key={item.label}>
                <div
                  onClick={() => {
                    if (item.hasDropdown) setMobileExpanded(mobileExpanded === item.label ? null : item.label);
                    else closeMobile();
                  }}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "14px 20px", cursor: "pointer",
                    borderLeft: mobileExpanded === item.label ? `4px solid ${theme.primary}` : "4px solid transparent",
                    background: mobileExpanded === item.label ? `${theme.lightPurple}33` : "transparent",
                    transition: "all 0.2s",
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: 0.5, color: mobileExpanded === item.label ? theme.primary : theme.dark }}>
                    {item.label}
                  </span>
                  {item.hasDropdown && (
                    <span style={{ color: theme.muted, display: "flex", transform: mobileExpanded === item.label ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                      <ChevronRight />
                    </span>
                  )}
                </div>

                {item.hasDropdown && mobileExpanded === item.label && megaMenus[item.label] && (
                  <div style={{ background: `${theme.lightPurple}22`, paddingBottom: 8 }}>
                    {megaMenus[item.label].sections.map((section) => (
                      <div key={section.category} style={{ padding: "10px 20px 4px 32px" }}>
                        <div style={{ fontSize: 11, fontWeight: 800, color: theme.primary, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                          {section.icon} {section.category}
                        </div>
                        {section.items.map((subItem) => (
                          <div key={subItem} onClick={closeMobile} style={{ fontSize: 13, color: "#555", padding: "6px 0 6px 8px", cursor: "pointer", borderBottom: `1px solid ${theme.lightPurple}44` }}>
                            {subItem}
                          </div>
                        ))}
                      </div>
                    ))}
                    <div style={{ margin: "10px 16px 4px", background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`, borderRadius: 8, padding: "10px 14px" }}>
                      <div style={{ fontSize: 11, color: "#fff", fontWeight: 600 }}>{megaMenus[item.label].promo}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Bottom Actions */}
          <div style={{ borderTop: `1px solid ${theme.lightPurple}`, marginTop: 8 }}>
            {[
              {
                icon: <UserIcon />, label: user ? user.full_name?.split(" ")[0] || "My Profile" : "My Profile",
                action: () => { guardedNavigate("/profile"); closeMobile(); },
                badge: null,
              },
              {
                icon: <HeartIcon filled={wishlistCount > 0} />, label: "Wishlist",
                action: () => { guardedNavigate("/wishlist"); closeMobile(); },
                badge: wishlistCount,
                badgeColor: "linear-gradient(135deg, #ff4d7d, #ff80ab)",
              },
              {
                icon: <BagIcon />, label: "My Bag",
                action: () => { guardedNavigate("/bag"); closeMobile(); },
                badge: bagCount,
              },
            ].map(({ icon, label, action, badge, badgeColor }) => (
              <div key={label} onClick={action} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", cursor: "pointer", borderBottom: `1px solid ${theme.lightPurple}44` }}>
                <span style={{ color: theme.primary, position: "relative" }}>
                  {icon}
                  {badge > 0 && (
                    <span style={{
                      position: "absolute", top: -5, right: -8,
                      background: badgeColor || `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
                      color: "#fff", fontSize: 9, fontWeight: 700,
                      minWidth: 15, height: 15, borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      padding: "0 2px",
                    }}>
                      {badge > 99 ? "99+" : badge}
                    </span>
                  )}
                </span>
                <span style={{ fontSize: 14, fontWeight: 600, color: theme.dark }}>{label}</span>
              </div>
            ))}
          </div>

        </div>

      </div>
    </>
  );
}

<div style={{
  background: theme.white,
  borderBottom: `2px solid ${theme.lightPurple}`, // ✅ bottom line (already ok)
  padding: "0 16px",
  boxShadow: `0 2px 12px ${theme.lightPurple}88`,

  // ✅ Sticky FIX (important upgrade)
  position: "sticky",
  top: 0,
  zIndex: 9999,
  backdropFilter: "blur(10px)" // optional premium feel
}}></div>