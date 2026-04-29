import { useState } from "react";
import theme from "./theme";
// const theme = {
//   primary: "#9400D3",
//   accent: "#ED80E9",
//   lightPurple: "#D3D3FF",
//   muted: "#D8BFD8",
//   white: "#ffffff",
//   dark: "#1a1a2e",
//   bg: "#f8f4ff",
// };

const HeartIcon = ({ filled }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? theme.accent : "none"} stroke={filled ? theme.accent : "#ccc"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill={theme.accent} stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
  </svg>
);

const allProducts = [
  { id: 1,  name: "Classic White Shirt",        brand: "Zuro Basics",   price: 799,  original: 1499, category: "MEN",    sub: "Topwear",           rating: 4.3, reviews: 234, emoji: "👔", badge: "Bestseller" },
  { id: 2,  name: "Slim Fit Jeans",             brand: "DenimCo",       price: 1299, original: 2499, category: "MEN",    sub: "Bottomwear",        rating: 4.5, reviews: 512, emoji: "👖", badge: "New" },
  { id: 3,  name: "Sports Running Shoes",       brand: "FlexFit",       price: 2199, original: 3999, category: "MEN",    sub: "Footwear",          rating: 4.7, reviews: 890, emoji: "👟", badge: "Hot" },
  { id: 4,  name: "Floral Wrap Dress",          brand: "BloomWear",     price: 999,  original: 2199, category: "WOMEN",  sub: "Topwear",           rating: 4.6, reviews: 340, emoji: "👗", badge: "Trending" },
  { id: 5,  name: "High Waist Palazzo",         brand: "StyleHub",      price: 699,  original: 1299, category: "WOMEN",  sub: "Bottomwear",        rating: 4.2, reviews: 180, emoji: "🩱", badge: "" },
  { id: 6,  name: "Block Heel Sandals",         brand: "StepUp",        price: 1499, original: 2799, category: "WOMEN",  sub: "Footwear",          rating: 4.4, reviews: 267, emoji: "👠", badge: "New" },
  { id: 7,  name: "Graphic Tee — Unicorn",      brand: "KidsKool",      price: 399,  original: 799,  category: "KIDS",   sub: "Topwear",           rating: 4.8, reviews: 620, emoji: "🦄", badge: "Hot" },
  { id: 8,  name: "Cargo Shorts",               brand: "MiniStyle",     price: 499,  original: 999,  category: "KIDS",   sub: "Bottomwear",        rating: 4.1, reviews: 145, emoji: "🩳", badge: "" },
  { id: 9,  name: "LED Light-Up Sneakers",      brand: "GlowKids",      price: 899,  original: 1799, category: "KIDS",   sub: "Footwear",          rating: 4.9, reviews: 730, emoji: "✨", badge: "Bestseller" },
  { id: 10, name: "Matte Red Lipstick",         brand: "GlowUp",        price: 349,  original: 599,  category: "BEAUTY", sub: "Lip Care",          rating: 4.7, reviews: 920, emoji: "💄", badge: "Hot" },
  { id: 11, name: "Rose Lip Balm SPF 30",       brand: "PureGlow",      price: 199,  original: 349,  category: "BEAUTY", sub: "Lip Care",          rating: 4.5, reviews: 480, emoji: "🌸", badge: "" },
  { id: 12, name: "Crystal Drop Earrings",      brand: "ShineOn",       price: 599,  original: 1199, category: "BEAUTY", sub: "Jewellery",         rating: 4.6, reviews: 310, emoji: "💎", badge: "Trending" },
  { id: 13, name: "Vitamin C Face Serum",       brand: "SkinLab",       price: 799,  original: 1499, category: "BEAUTY", sub: "Skin Care",         rating: 4.8, reviews: 660, emoji: "🧴", badge: "New" },
  { id: 14, name: "Oversized Hoodie",           brand: "StreetZone",    price: 1199, original: 2199, category: "MEN",    sub: "Topwear",           rating: 4.6, reviews: 445, emoji: "🧥", badge: "New" },
  { id: 15, name: "Pearl Stud Earrings",        brand: "LuxeGems",      price: 899,  original: 1799, category: "BEAUTY", sub: "Jewellery",         rating: 4.9, reviews: 540, emoji: "🦪", badge: "Bestseller" },
  { id: 16, name: "Kurti with Embroidery",      brand: "EthnicVibes",   price: 1099, original: 2199, category: "WOMEN",  sub: "Topwear",           rating: 4.5, reviews: 388, emoji: "🪡", badge: "Trending" },
  { id: 17, name: "Formal Oxford Shoes",        brand: "EliteStep",     price: 2499, original: 4499, category: "MEN",    sub: "Footwear",          rating: 4.4, reviews: 200, emoji: "👞", badge: "" },
  { id: 18, name: "Tie-Dye Crop Tee",           brand: "BohoKids",      price: 449,  original: 899,  category: "KIDS",   sub: "Topwear",           rating: 4.3, reviews: 210, emoji: "🎨", badge: "" },
];

const categories = ["ALL", "MEN", "WOMEN", "KIDS", "BEAUTY"];
const sortOptions = ["Relevance", "Price: Low to High", "Price: High to Low", "Rating", "New Arrivals"];

const badgeColors = {
  "Bestseller": { bg: "#fff7ed", color: "#ea580c" },
  "New":        { bg: "#f0fdf4", color: "#16a34a" },
  "Hot":        { bg: "#fef2f2", color: "#dc2626" },
  "Trending":   { bg: "#fdf4ff", color: theme.primary },
};

const banners = [
  { title: "Summer Sale", sub: "Up to 70% off on all categories", emoji: "☀️", grad: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})` },
  { title: "New Arrivals", sub: "Fresh styles just landed", emoji: "✨", grad: "linear-gradient(135deg, #f59e0b, #ef4444)" },
  { title: "Beauty Picks", sub: "Top rated skincare & makeup", emoji: "💄", grad: "linear-gradient(135deg, #ec4899, #8b5cf6)" },
];

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [sortBy, setSortBy]                 = useState("Relevance");
  const [wishlist, setWishlist]             = useState([]);
  const [activeBanner, setActiveBanner]     = useState(0);
  const [priceRange, setPriceRange]         = useState(5000);

  const toggleWishlist = (id) =>
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  let filtered = allProducts.filter(p =>
    (activeCategory === "ALL" || p.category === activeCategory) && p.price <= priceRange
  );

  if (sortBy === "Price: Low to High")  filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sortBy === "Price: High to Low")  filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sortBy === "Rating")              filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  if (sortBy === "New Arrivals")        filtered = [...filtered].filter(p => p.badge === "New");

  const discount = (p, o) => Math.round(((o - p) / o) * 100);

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>

      {/* ── Hero Banner ── */}
      <div style={{ padding: "20px 24px 0", maxWidth: 1280, margin: "0 auto" }}>
        {/* <div style={{
          borderRadius: 16, overflow: "hidden", position: "relative",
          background: banners[activeBanner].grad,
          padding: "36px 40px", minHeight: 160,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ position: "absolute", top: -30, right: 80, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
          <div>
            <div style={{ fontSize: 36 }}>{banners[activeBanner].emoji}</div>
            <h2 style={{ margin: "8px 0 4px", fontSize: 28, fontWeight: 900, color: "#fff" }}>{banners[activeBanner].title}</h2>
            <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.85)" }}>{banners[activeBanner].sub}</p>
            <button style={{
              marginTop: 16, background: "#fff", border: "none", borderRadius: 24,
              padding: "10px 28px", fontSize: 13, fontWeight: 800,
              color: theme.primary, cursor: "pointer", fontFamily: "inherit",
            }}>Shop Now →</button>
          </div>
       
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {banners.map((_, i) => (
              <button key={i} onClick={() => setActiveBanner(i)} style={{
                width: i === activeBanner ? 24 : 8, height: 8, borderRadius: 4,
                background: i === activeBanner ? "#fff" : "rgba(255,255,255,0.4)",
                border: "none", cursor: "pointer", padding: 0,
                transition: "all 0.3s",
              }} />
            ))}
          </div>
        </div> */}
      </div>

      {/* ── Category Chips ── */}
      <div style={{ maxWidth: 1280, margin: "20px auto 0", padding: "0 24px" }}>
        <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{
              border: activeCategory === cat ? `2px solid ${theme.primary}` : `2px solid ${theme.muted}`,
              background: activeCategory === cat ? `linear-gradient(135deg, ${theme.primary}, ${theme.accent})` : theme.white,
              color: activeCategory === cat ? "#fff" : theme.dark,
              borderRadius: 24, padding: "8px 22px", fontSize: 13, fontWeight: 700,
              cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit",
              transition: "all 0.2s",
            }}>{cat}</button>
          ))}
        </div>
      </div>

      {/* ── Filter + Sort bar ── */}
      <div style={{ maxWidth: 1280, margin: "16px auto 0", padding: "0 24px" }}>
        <div style={{
          background: theme.white, borderRadius: 12, padding: "14px 20px",
          display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap",
          boxShadow: "0 2px 12px rgba(148,0,211,0.06)",
          border: `1px solid ${theme.lightPurple}44`,
        }}>
          {/* Results count */}
          <span style={{ fontSize: 13, color: "#888", fontWeight: 600 }}>
            <strong style={{ color: theme.primary }}>{filtered.length}</strong> products
          </span>

          <div style={{ height: 20, width: 1, background: theme.muted }} />

          {/* Price filter */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, color: "#888", fontWeight: 600, whiteSpace: "nowrap" }}>MAX PRICE</span>
            <input type="range" min="200" max="5000" step="100" value={priceRange}
              onChange={e => setPriceRange(Number(e.target.value))}
              style={{ width: 100, accentColor: theme.primary }}
            />
            <span style={{ fontSize: 13, fontWeight: 700, color: theme.primary, minWidth: 52 }}>₹{priceRange}</span>
          </div>

          <div style={{ height: 20, width: 1, background: theme.muted }} />

          {/* Sort */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
            <span style={{ fontSize: 12, color: "#888", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
              <FilterIcon /> SORT BY
            </span>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{
              border: `1.5px solid ${theme.lightPurple}`, borderRadius: 8,
              padding: "6px 12px", fontSize: 13, color: theme.dark,
              background: theme.white, cursor: "pointer", fontFamily: "inherit",
              outline: "none",
            }}>
              {sortOptions.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* ── Product Grid ── */}
      <div style={{ maxWidth: 1280, margin: "20px auto 60px", padding: "0 24px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#aaa" }}>
            <div style={{ fontSize: 48 }}>🔍</div>
            <p style={{ fontSize: 16, marginTop: 16 }}>No products found. Try adjusting filters.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 18 }}>
            {filtered.map(product => (
              <div key={product.id} style={{
                background: theme.white, borderRadius: 16, overflow: "hidden",
                boxShadow: "0 2px 16px rgba(148,0,211,0.07)",
                border: `1px solid ${theme.lightPurple}44`,
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "pointer",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 8px 28px rgba(148,0,211,0.14)`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 16px rgba(148,0,211,0.07)"; }}
              >
                {/* Image area */}
                <div style={{
                  height: 180, background: `${theme.lightPurple}33`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 64, position: "relative",
                }}>
                  {product.emoji}
                  {/* wishlist btn */}
                  <button onClick={e => { e.stopPropagation(); toggleWishlist(product.id); }} style={{
                    position: "absolute", top: 10, right: 10,
                    background: "#fff", border: "none", borderRadius: "50%",
                    width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}>
                    <HeartIcon filled={wishlist.includes(product.id)} />
                  </button>
                  {/* badge */}
                  {product.badge && (
                    <span style={{
                      position: "absolute", top: 10, left: 10,
                      fontSize: 10, fontWeight: 700,
                      padding: "3px 8px", borderRadius: 6,
                      background: badgeColors[product.badge]?.bg,
                      color: badgeColors[product.badge]?.color,
                    }}>{product.badge}</span>
                  )}
                  {/* discount */}
                  <span style={{
                    position: "absolute", bottom: 10, left: 10,
                    background: theme.primary, color: "#fff",
                    fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 6,
                  }}>{discount(product.price, product.original)}% OFF</span>
                </div>

                {/* Info */}
                <div style={{ padding: "14px 14px 16px" }}>
                  <div style={{ fontSize: 11, color: "#aaa", fontWeight: 600, marginBottom: 3 }}>{product.brand}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: theme.dark, marginBottom: 6, lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{product.name}</div>

                  {/* Rating */}
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 10 }}>
                    <span style={{
                      background: "#22c55e", color: "#fff", fontSize: 11, fontWeight: 700,
                      padding: "2px 7px", borderRadius: 4, display: "flex", alignItems: "center", gap: 3,
                    }}>
                      {product.rating} <StarIcon />
                    </span>
                    <span style={{ fontSize: 11, color: "#aaa" }}>({product.reviews})</span>
                  </div>

                  {/* Price */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 16, fontWeight: 800, color: theme.dark }}>₹{product.price}</span>
                    <span style={{ fontSize: 12, color: "#bbb", textDecoration: "line-through" }}>₹{product.original}</span>
                  </div>

                  {/* Add to bag */}
                  <button style={{
                    width: "100%", marginTop: 12,
                    background: "#000",
                    color: "#fff", border: "none", borderRadius: 8,
                    padding: "10px 0", fontSize: 13, fontWeight: 700,
                    cursor: "pointer", fontFamily: "inherit",
                    transition: "opacity 0.2s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
