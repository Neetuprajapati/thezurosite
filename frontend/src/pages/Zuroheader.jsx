import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assest/logo/thezurologo.png";

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const UserIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const HeartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const BagIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);
const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const NotFoundIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    <line x1="8" y1="11" x2="14" y2="11" />
  </svg>
);

const navItems = [
  { label: "Shop",         path: "/home" },
  { label: "Men",          path: "/category/men" },
  { label: "Women",        path: "/category/women" },
  { label: "PERFUME",      path: "/category/perfume" },
  { label: "SHOES",        path: "/category/shoes" },
  { label: "NEW ARRIVALS", path: "/category/new-arrivals" },
  { label: "CONTACT US",   path: "/contact" },
];

const getPrimaryImage = (media) => {
  if (!Array.isArray(media) || !media.length) return null;
  return (
    media.find(m => m.is_primary && m.media_type === "image") ||
    media.find(m => m.media_type === "image")
  )?.media_url || null;
};

export default function LuxuryHeader() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const searchRef  = useRef(null);

  const [mobileOpen,    setMobileOpen]    = useState(false);
  const [query,         setQuery]         = useState("");
  const [allProducts,   setAllProducts]   = useState([]);
  const [results,       setResults]       = useState([]);
  const [showDropdown,  setShowDropdown]  = useState(false);
  const [searching,     setSearching]     = useState(false);
  const [productsLoaded, setProductsLoaded] = useState(false);

  const activeNav = navItems.find(
    item => item.path !== "/home" && location.pathname === item.path
  )?.label ?? null;

  // ── Load all products once ──────────────────────────────────
  useEffect(() => {
    fetch("https://api.thezuro.com/api/products")
      .then(r => r.json())
      .then(data => {
        setAllProducts(Array.isArray(data) ? data : []);
        setProductsLoaded(true);
      })
      .catch(() => setProductsLoaded(true));
  }, []);

  // ── Search logic — filter by title, brand, category ─────────
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) { setResults([]); setShowDropdown(false); return; }

    setSearching(true);
    setShowDropdown(true);

    const timer = setTimeout(() => {
      const filtered = allProducts.filter(p =>
        p.title?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      ).slice(0, 8); // max 8 results
      setResults(filtered);
      setSearching(false);
    }, 250); // debounce

    return () => clearTimeout(timer);
  }, [query, allProducts]);

  // ── Close dropdown on outside click ─────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleProductClick = (id) => {
    setQuery("");
    setShowDropdown(false);
    navigate(`/product/${id}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") { setShowDropdown(false); setQuery(""); }
    if (e.key === "Enter" && results.length > 0) {
      handleProductClick(results[0].id);
    }
  };

  // ── Search box component (reused for desktop + mobile) ──────
  const SearchBox = ({ mobile = false }) => (
    <div ref={mobile ? null : searchRef} style={{ position: "relative", width: mobile ? "100%" : 220 }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        background: "#f8f5f2", border: "1px solid #e8ddd5",
        borderRadius: 40, padding: "10px 16px",
        width: "100%",
        boxShadow: showDropdown && !mobile ? "0 2px 12px rgba(0,0,0,0.08)" : "none",
      }}>
        <div style={{ color: "#aaa", flexShrink: 0, display: "flex" }}><SearchIcon /></div>
        <input
          type="text"
          placeholder="Search products, brands..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => query.trim() && setShowDropdown(true)}
          onKeyDown={handleKeyDown}
          style={{ border: "none", outline: "none", background: "transparent", width: "100%", fontSize: 13, color: "#333", fontFamily: "Montserrat" }}
        />
        {query && (
          <button onClick={() => { setQuery(""); setShowDropdown(false); }}
            style={{ border: "none", background: "none", cursor: "pointer", color: "#aaa", display: "flex", padding: 0 }}>
            <CloseIcon />
          </button>
        )}
      </div>

      {/* ── DROPDOWN ── */}
      {showDropdown && (
        <div style={{
          position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0,
          background: "#fff", borderRadius: 12, overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.14)", zIndex: 99999,
          border: "1px solid #f0eae0",
          minWidth: mobile ? "100%" : 340,
        }}>
          {/* Loading */}
          {searching && (
            <div style={{ padding: "20px", textAlign: "center", color: "#aaa", fontSize: 13, fontFamily: "Montserrat" }}>
              Searching...
            </div>
          )}

          {/* Results */}
          {!searching && results.length > 0 && (
            <>
              <div style={{ padding: "10px 16px 6px", fontSize: 10, color: "#bbb", letterSpacing: 2, textTransform: "uppercase", fontFamily: "Montserrat", fontWeight: 600 }}>
                {results.length} result{results.length > 1 ? "s" : ""} found
              </div>
              {results.map(product => {
                const imgUrl    = getPrimaryImage(product.media);
                const salePrice = product.sale_price ?? product.base_price ?? 0;
                return (
                  <div key={product.id}
                    onClick={() => handleProductClick(product.id)}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", cursor: "pointer", transition: "background 0.15s", borderBottom: "1px solid #f8f8f8" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#faf8f5"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    {/* Image */}
                    <div style={{ width: 44, height: 44, borderRadius: 8, background: "#f5f4f0", overflow: "hidden", flexShrink: 0 }}>
                      {imgUrl
                        ? <img src={imgUrl} alt={product.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🛍️</div>
                      }
                    </div>
                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: "Montserrat" }}>
                        {product.title}
                      </div>
                      <div style={{ fontSize: 11, color: "#B8933A", marginTop: 2, fontFamily: "Montserrat" }}>
                        {product.brand} · {product.category}
                      </div>
                    </div>
                    {/* Price */}
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", fontFamily: "Montserrat", flexShrink: 0 }}>
                      ₹{salePrice.toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {/* Not Found */}
          {!searching && results.length === 0 && query.trim() && (
            <div style={{ padding: "28px 20px", textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}><NotFoundIcon /></div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#555", margin: "0 0 4px", fontFamily: "Montserrat" }}>
                No results for "{query}"
              </p>
              <p style={{ fontSize: 12, color: "#bbb", margin: 0, fontFamily: "Montserrat" }}>
                Try searching by product name, brand or category
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Montserrat:wght@400;500;600&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; }
        .left-nav       { display: flex; }
        .mobile-menu    { display: none; }
        .mobile-drawer  { display: none; }
        .desktop-search { display: flex; }
        @media(max-width: 1100px) {
          .left-nav       { display: none !important; }
          .desktop-search { display: none !important; }
          .mobile-menu    { display: flex !important; }
          .mobile-drawer  { display: block !important; }
          .header-wrapper { height: 70px !important; }
        }
      `}</style>

      <div style={{ width: "100%", background: "#fff", position: "sticky", top: 0, zIndex: 9999, borderBottom: "1px solid #eee", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>

        {/* TOP BAR */}
        <div style={{ background: "linear-gradient(135deg, #a87c2a, #c9a84c, #e8cc6e, #c9a84c, #a87c2a)", color: "#4a3200", textAlign: "center", padding: "8px 10px", fontSize: 12, fontWeight: 600, letterSpacing: 1, fontFamily: "Montserrat" }}>
          ✨ FREE SHIPPING ON ORDERS ABOVE ₹999 ✨
        </div>

        {/* MAIN HEADER */}
        <div className="header-wrapper" style={{ maxWidth: 1450, margin: "0 auto", height: 86, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", background: "#fff" }}>

          {/* LEFT */}
          <div style={{ display: "flex", alignItems: "center", gap: 32, flex: 1 }}>
            <button className="mobile-menu" onClick={() => setMobileOpen(true)} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#333" }}>
              <MenuIcon />
            </button>
            <img src={logo} alt="The Zuro" onClick={() => navigate("/home")} style={{ height: 58, width: "auto", objectFit: "contain", cursor: "pointer", flexShrink: 0 }} />
            <nav className="left-nav" style={{ alignItems: "center", gap: 28 }}>
              {navItems.map(({ label, path }) => {
                const active = activeNav === label;
                return (
                  <div key={label} onClick={() => navigate(path)} style={{ position: "relative", cursor: "pointer", paddingBottom: 4 }}>
                    <span style={{ fontSize: 12, letterSpacing: 1.3, fontWeight: active ? 700 : 600, color: active ? "rgb(184,147,58)" : "#444", fontFamily: "Montserrat", transition: "color 0.3s", whiteSpace: "nowrap" }}>
                      {label}
                    </span>
                    {active && <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "rgb(184,147,58)", borderRadius: 20 }} />}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* RIGHT */}
          <div style={{ display: "flex", alignItems: "center", gap: 20, flexShrink: 0 }}>
            <div className="desktop-search" ref={searchRef} style={{ position: "relative" }}>
              <SearchBox />
            </div>
            <button onClick={() => navigate("/profile")} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#333" }}><UserIcon /></button>
            <button onClick={() => navigate("/wishlist")} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#333" }}><HeartIcon /></button>
            <button onClick={() => navigate("/bag")} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#333" }}><BagIcon /></button>
          </div>
        </div>

        {/* MOBILE DRAWER */}
        <div className="mobile-drawer" style={{ position: "fixed", top: 0, left: mobileOpen ? 0 : "-100%", width: 300, height: "100vh", background: "#fff", zIndex: 999999, transition: "0.4s", boxShadow: "4px 0 30px rgba(0,0,0,0.1)" }}>
          <div style={{ height: 70, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", borderBottom: "1px solid #eee" }}>
            <img src={logo} alt="The Zuro" style={{ height: 40, width: "auto", objectFit: "contain" }} />
            <button onClick={() => setMobileOpen(false)} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#333" }}><CloseIcon /></button>
          </div>

          {/* MOBILE SEARCH */}
          <div style={{ padding: 20 }}>
            <SearchBox mobile={true} />
          </div>

          {/* MOBILE NAV */}
          <div>
            {navItems.map(({ label, path }) => (
              <div key={label} onClick={() => { navigate(path); setMobileOpen(false); }}
                style={{ padding: "18px 24px", borderBottom: "1px solid #f5f5f5", cursor: "pointer", color: activeNav === label ? "rgb(184,147,58)" : "#444", fontWeight: 600, letterSpacing: 1, fontSize: 13, fontFamily: "Montserrat" }}>
                {label}
              </div>
            ))}
          </div>
        </div>

        {mobileOpen && <div onClick={() => setMobileOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 99999 }} />}
      </div>
    </>
  );
}