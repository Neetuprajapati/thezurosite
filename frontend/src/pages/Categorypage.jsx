import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../config/api";

const API = API_URL;
const getToken = () => localStorage.getItem("token");

// ── Category config — name, slug, hero bg, headline ──────────────────────
const CATEGORY_CONFIG = {
  men: {
    name: "Men",
    headline: "Men's Collection",
    sub: "Premium fashion curated for the modern man",
    bg: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)",
    accent: "#c9a84c",
    emoji: "👔",
    apiCategory: "Men",
  },
  women: {
    name: "Women",
    headline: "Women's Collection",
    sub: "Effortless elegance for every occasion",
    bg: "linear-gradient(135deg, #160808 0%, #2e1010 100%)",
    accent: "#f5c6c6",
    emoji: "👗",
    apiCategory: "Women",
  },
  perfume: {
    name: "Perfume",
    headline: "Luxury Perfumes",
    sub: "Signature fragrances for every personality",
    bg: "linear-gradient(135deg, #1a0810 0%, #2e0f22 100%)",
    accent: "#e8c5a0",
    emoji: "🌸",
    apiCategory: "Perfume",
  },
  shoes: {
    name: "Shoes",
    headline: "Designer Footwear",
    sub: "Walk bold — shoes that make a statement",
    bg: "linear-gradient(135deg, #0a0f1a 0%, #0d1e38 100%)",
    accent: "#6ba3d6",
    emoji: "👟",
    apiCategory: "Shoes",
  },
  "new-arrivals": {
    name: "New Arrivals",
    headline: "New Arrivals",
    sub: "Fresh drops — the latest additions to theZuro",
    bg: "linear-gradient(135deg, #0a1a0a 0%, #0f2e10 100%)",
    accent: "#a8c9a8",
    emoji: "✨",
    apiCategory: "New Arrivals",
  },
};

const StarIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const HeartIcon = ({ filled }) => (
  <svg width="20" height="20" viewBox="0 0 24 24"
    fill={filled ? "#e11d48" : "none"}
    stroke={filled ? "#e11d48" : "#fff"} strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const BagIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>
);

const getPrimaryImage = (media) => {
  if (!Array.isArray(media) || !media.length) return null;
  return (
    media.find(m => m.is_primary && m.media_type === "image") ||
    media.find(m => m.media_type === "image")
  )?.media_url || null;
};

export default function CategoryPage() {
  const { category } = useParams(); // e.g. "men", "women", "perfume"
  const navigate = useNavigate();
  const config = CATEGORY_CONFIG[category];

  const [products, setProducts]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [sortBy, setSortBy]           = useState("Relevance");
  const [priceRange, setPriceRange]   = useState(5000);
  const [toast, setToast]             = useState(null);
  const [addingId, setAddingId]       = useState(null);

  // Redirect if invalid category
  useEffect(() => {
    if (!config) navigate("/home");
  }, [category, config, navigate]);

  const showToast = (msg, color = "#16a34a") => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2500);
  };

  // ── Fetch all products then filter by category ──
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${API}/products`)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(data => {
        const all = Array.isArray(data) ? data : [];
        console.log("🔍 API Products:", all);
        console.log("🎯 Expected Category:", config?.apiCategory);
        console.log("📊 Available Categories:", [...new Set(all.map(p => p.category))]);
        // Filter by category name (case-insensitive)
        const filtered = all.filter(p =>
          p.category?.toLowerCase() === config?.apiCategory?.toLowerCase()
        );
        console.log("✅ Filtered Products:", filtered);
        setProducts(filtered);
        setLoading(false);
      })
      .catch(err => { setError(err.message); setLoading(false); });
  }, [category, config]);

  // ── Fetch wishlist ──
  useEffect(() => {
    const token = getToken();
    if (!token) return;
    fetch(`${API}/wishlist/ids`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(ids => setWishlistIds(new Set(ids)))
      .catch(() => {});
  }, []);

  const toggleWishlist = useCallback(async (e, productId) => {
    e.stopPropagation();
    const token = getToken();
    if (!token) { navigate("/login"); return; }
    const isAdded = wishlistIds.has(productId);
    setWishlistIds(prev => {
      const n = new Set(prev); isAdded ? n.delete(productId) : n.add(productId); return n;
    });
    try {
      if (isAdded) {
        await fetch(`${API}/wishlist/${productId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
        showToast("Removed from Wishlist", "#6b7280");
      } else {
        await fetch(`${API}/wishlist`, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ productId }) });
        showToast("❤️ Saved to Wishlist");
      }
    } catch {
      setWishlistIds(prev => { const n = new Set(prev); isAdded ? n.add(productId) : n.delete(productId); return n; });
      showToast("Something went wrong", "#dc2626");
    }
  }, [wishlistIds, navigate]);

  const addToBag = useCallback(async (e, product) => {
    e.stopPropagation();
    const token = getToken();
    if (!token) { navigate("/login"); return; }
    setAddingId(product.id);
    try {
      const r = await fetch(`${API}/products/${product.id}`, { headers: { Authorization: `Bearer ${token}` } });
      const detail = await r.json();
      const variantId = detail.variants?.[0]?.id;
      if (!variantId) { showToast("No variant available", "#dc2626"); return; }
      const res = await fetch(`${API}/bag`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ variantId, quantity: 1 }),
      });
      if (!res.ok) { const err = await res.json(); showToast(err.error || "Error", "#dc2626"); return; }
      showToast("🛒 Added to Bag!");
    } catch { showToast("Could not add to bag", "#dc2626"); }
    finally { setAddingId(null); }
  }, [navigate]);

  // ── Sort + price filter ──
  let filtered = products.filter(p => (p.sale_price ?? p.base_price ?? 0) <= priceRange);
  if (sortBy === "Price: Low to High") filtered = [...filtered].sort((a, b) => (a.sale_price ?? a.base_price) - (b.sale_price ?? b.base_price));
  else if (sortBy === "Price: High to Low") filtered = [...filtered].sort((a, b) => (b.sale_price ?? b.base_price) - (a.sale_price ?? a.base_price));
  else if (sortBy === "Rating") filtered = [...filtered].sort((a, b) => b.rating - a.rating);

  if (!config) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#f8f7f4" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Jost:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        .cat-card { transition: transform .3s ease, box-shadow .3s ease; }
        .cat-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,.14) !important; }
        .cat-card:hover .cat-overlay { opacity: 1 !important; }
        .cat-card:hover .cat-img { transform: scale(1.06); }
        .cat-img { transition: transform .45s ease; }
        .heart-btn { transition: transform .2s ease !important; }
        .heart-btn:hover { transform: scale(1.2) !important; }
        .btn-dark:hover { background: #333 !important; }
        .shimmer { background: linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%); background-size: 200%; animation: shimmer 1.5s infinite; }
        @keyframes shimmer { 0%{background-position:200%} 100%{background-position:-200%} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp .5s ease both; }
        .range-styled { -webkit-appearance:none; height:3px; border-radius:2px; outline:none; cursor:pointer; }
        .range-styled::-webkit-slider-thumb { -webkit-appearance:none; width:16px; height:16px; border-radius:50%; background:#c9a84c; cursor:pointer; }
      `}</style>

      {/* TOAST */}
      {toast && (
        <div style={{ position:"fixed", top:80, left:"50%", transform:"translateX(-50%)", background:toast.color, color:"#fff", padding:"11px 22px", borderRadius:5, zIndex:9999, fontSize:13, fontWeight:600, fontFamily:"'Jost',sans-serif", boxShadow:"0 8px 24px rgba(0,0,0,.2)", whiteSpace:"nowrap" }}>
          {toast.msg}
        </div>
      )}

      {/* ── HERO ── */}
      <div style={{ position:"relative", height:320, background:config.bg, display:"flex", alignItems:"center", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"repeating-linear-gradient(90deg,rgba(255,255,255,.025) 0,rgba(255,255,255,.025) 1px,transparent 1px,transparent 80px)", pointerEvents:"none" }} />
        {/* big emoji deco */}
        <div style={{ position:"absolute", right:80, top:"50%", transform:"translateY(-50%)", fontSize:180, opacity:.08, userSelect:"none" }}>
          {config.emoji}
        </div>
        <div style={{ position:"relative", zIndex:2, padding:"0 60px" }} className="fade-up">
          <p style={{ margin:"0 0 10px", color:config.accent, fontSize:10, fontWeight:600, letterSpacing:4, textTransform:"uppercase", fontFamily:"'Jost',sans-serif" }}>
            theZuro
          </p>
          <h1 style={{ margin:"0 0 14px", color:"#fff", fontSize:52, fontWeight:900, lineHeight:1.08, fontFamily:"'Playfair Display',serif", textShadow:"0 4px 28px rgba(0,0,0,.5)" }}>
            {config.headline}
          </h1>
          <p style={{ margin:0, color:"rgba(255,255,255,.5)", fontSize:14, fontFamily:"'Jost',sans-serif", fontWeight:300 }}>
            {config.sub}
          </p>
        </div>
        {/* bottom fade */}
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:80, background:"linear-gradient(to bottom, transparent, #f8f7f4)", pointerEvents:"none" }} />
      </div>

      {/* ── FILTER BAR ── */}
      <div style={{ background:"#fff", borderBottom:"1px solid #ebebeb", padding:"13px 40px", display:"flex", alignItems:"center", gap:20 }}>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          style={{ border:"none", background:"transparent", fontSize:11, color:"#666", cursor:"pointer", outline:"none", letterSpacing:1, textTransform:"uppercase", fontFamily:"'Jost',sans-serif", fontWeight:500 }}>
          {["Relevance","Price: Low to High","Price: High to Low","Rating"].map(o => <option key={o}>{o}</option>)}
        </select>
        <div style={{ width:1, height:18, background:"#e5e5e5" }} />
        <span style={{ fontSize:11, color:"#bbb", fontFamily:"'Jost',sans-serif", letterSpacing:1 }}>
          {loading ? "Loading…" : `${filtered.length} ${filtered.length === 1 ? "product" : "products"}`}
        </span>
        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontSize:11, color:"#aaa", letterSpacing:1, textTransform:"uppercase", fontFamily:"'Jost',sans-serif" }}>Max Price</span>
          <input type="range" min="100" max="5000" value={priceRange}
            onChange={e => setPriceRange(Number(e.target.value))}
            className="range-styled"
            style={{ width:130, background:`linear-gradient(to right,#c9a84c ${((priceRange-100)/4900)*100}%,#e0e0e0 0%)` }} />
          <span style={{ fontSize:13, fontWeight:600, color:"#1a1a1a", fontFamily:"'Jost',sans-serif", minWidth:60 }}>
            ₹{priceRange.toLocaleString()}
          </span>
        </div>
      </div>

      {/* ── PRODUCT GRID ── */}
      <div style={{ padding:"36px 40px 80px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:28 }}>
          <h2 style={{ margin:0, fontSize:24, fontWeight:700, color:"#1a1a1a", fontFamily:"'Playfair Display',serif" }}>
            {config.name}
          </h2>
          <div style={{ flex:1, height:1, background:"linear-gradient(to right,#e0e0e0,transparent)" }} />
        </div>

        {/* Skeleton */}
        {loading && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))", gap:22 }}>
            {[1,2,3,4].map(i => (
              <div key={i} style={{ borderRadius:8, overflow:"hidden", background:"#fff" }}>
                <div className="shimmer" style={{ height:290 }} />
                <div style={{ padding:16 }}>
                  <div className="shimmer" style={{ height:10, borderRadius:4, marginBottom:10, width:"55%" }} />
                  <div className="shimmer" style={{ height:15, borderRadius:4, marginBottom:12, width:"80%" }} />
                  <div className="shimmer" style={{ height:10, borderRadius:4, width:"35%" }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && <p style={{ color:"#dc2626", fontFamily:"'Jost',sans-serif" }}>⚠️ {error}</p>}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div style={{ textAlign:"center", padding:"70px 20px" }}>
            <div style={{ fontSize:64 }}>{config.emoji}</div>
            <p style={{ color:"#888", fontFamily:"'Jost',sans-serif", fontSize:15, marginTop:16, marginBottom:8 }}>
              No {config.name} products found
            </p>
            <p style={{ color:"#bbb", fontFamily:"'Jost',sans-serif", fontSize:13, marginBottom:20 }}>
              Try adding products with category "{config.apiCategory}" in your database
            </p>
            <button onClick={() => setPriceRange(5000)}
              style={{ padding:"11px 26px", background:"#1a1a1a", color:"#fff", border:"none", borderRadius:3, cursor:"pointer", fontSize:11, letterSpacing:2, textTransform:"uppercase", fontFamily:"'Jost',sans-serif" }}>
              Reset Filter
            </button>
          </div>
        )}

        {/* Products */}
        {!loading && filtered.length > 0 && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))", gap:22 }}>
            {filtered.map(product => {
              const imgUrl    = getPrimaryImage(product.media);
              const salePrice = product.sale_price ?? null;
              const basePrice = product.base_price ?? 0;
              const pct       = basePrice && salePrice ? Math.round(((basePrice - salePrice) / basePrice) * 100) : 0;
              const inWish    = wishlistIds.has(product.id);
              const isAdding  = addingId === product.id;

              return (
                <div key={product.id} className="cat-card"
                  onClick={() => navigate(`/product/${product.id}`)}
                  style={{ background:"#fff", borderRadius:8, overflow:"hidden", cursor:"pointer", position:"relative", boxShadow:"0 2px 10px rgba(0,0,0,.06)" }}>

                  {/* Image */}
                  <div style={{ position:"relative", height:290, background:"#f5f4f0", overflow:"hidden" }}>
                    {imgUrl
                      ? <img src={imgUrl} alt={product.title} className="cat-img" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} onError={e => { e.target.style.display="none"; }} />
                      : <div style={{ height:"100%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:52 }}>{config.emoji}</div>
                    }
                    {pct > 0 && (
                      <div style={{ position:"absolute", top:11, left:11, background:"#e11d48", color:"#fff", fontSize:10, fontWeight:700, padding:"3px 7px", borderRadius:2, letterSpacing:1, fontFamily:"'Jost',sans-serif" }}>
                        {pct}% OFF
                      </div>
                    )}
                    <div className="cat-overlay" style={{ position:"absolute", inset:0, background:"rgba(0,0,0,.22)", display:"flex", alignItems:"flex-end", justifyContent:"center", padding:"0 14px 14px", opacity:0, transition:"opacity .25s ease" }}>
                      <button onClick={e => addToBag(e, product)} disabled={isAdding}
                        style={{ width:"100%", padding:"11px 0", background:"#fff", color:"#1a1a1a", border:"none", borderRadius:3, fontSize:10, fontWeight:700, cursor:"pointer", letterSpacing:2, textTransform:"uppercase", fontFamily:"'Jost',sans-serif", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                        <BagIcon /> {isAdding ? "Adding…" : "Add to Bag"}
                      </button>
                    </div>
                    <button className="heart-btn" onClick={e => toggleWishlist(e, product.id)}
                      style={{ position:"absolute", top:11, right:11, background: inWish ? "rgba(225,29,72,.12)" : "rgba(255,255,255,.88)", border:"none", borderRadius:"50%", width:35, height:35, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", backdropFilter:"blur(4px)", boxShadow:"0 2px 8px rgba(0,0,0,.14)" }}>
                      <HeartIcon filled={inWish} />
                    </button>
                  </div>

                  {/* Info */}
                  <div style={{ padding:"14px 16px 18px" }}>
                    <p style={{ margin:"0 0 3px", fontSize:10, color:"#c9a84c", fontWeight:600, letterSpacing:2, textTransform:"uppercase", fontFamily:"'Jost',sans-serif" }}>
                      {product.brand}
                    </p>
                    <h4 style={{ margin:"0 0 10px", fontSize:14, fontWeight:400, color:"#1a1a1a", lineHeight:1.4, fontFamily:"'Playfair Display',serif", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                      {product.title}
                    </h4>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
                      <div style={{ display:"flex", alignItems:"baseline", gap:7 }}>
                        <span style={{ fontSize:16, fontWeight:700, color:"#1a1a1a", fontFamily:"'Jost',sans-serif" }}>₹{(salePrice ?? basePrice).toLocaleString()}</span>
                        {salePrice && <span style={{ fontSize:11, color:"#c0b9b9", textDecoration:"line-through", fontFamily:"'Jost',sans-serif" }}>₹{basePrice.toLocaleString()}</span>}
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:3, background:"#f8f7f4", padding:"3px 8px", borderRadius:12 }}>
                        <span style={{ color:"#c9a84c" }}><StarIcon /></span>
                        <span style={{ fontSize:11, fontWeight:600, color:"#555", fontFamily:"'Jost',sans-serif" }}>{Number(product.rating).toFixed(1)}</span>
                        <span style={{ fontSize:10, color:"#bbb", fontFamily:"'Jost',sans-serif" }}>({product.review_count})</span>
                      </div>
                    </div>
                    <button onClick={e => addToBag(e, product)} disabled={isAdding} className="btn-dark"
                      style={{ width:"100%", padding:"10px 0", background:"#1a1a1a", color:"#fff", border:"none", borderRadius:3, fontSize:10, fontWeight:600, cursor:"pointer", letterSpacing:2, textTransform:"uppercase", fontFamily:"'Jost',sans-serif", display:"flex", alignItems:"center", justifyContent:"center", gap:7, transition:"background .2s" }}>
                      <BagIcon /> {isAdding ? "Adding…" : "Add to Bag"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}