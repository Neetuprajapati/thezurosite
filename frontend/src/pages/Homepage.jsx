import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://api.thezuro.com/api";
const getToken = () => localStorage.getItem("token");

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

const sortOptions = ["Relevance", "Price: Low to High", "Price: High to Low", "Rating"];

const getPrimaryImage = (media) => {
  if (!Array.isArray(media) || !media.length) return null;
  return (
    media.find(m => m.is_primary && m.media_type === "image") ||
    media.find(m => m.media_type === "image")
  )?.media_url || null;
};

// ─────────────────────────────────────────────────────────
//  HERO SLIDES — curated high-quality Unsplash images
//  Each URL is pinned to a specific photo ID so it never
//  changes. ?auto=format serves AVIF/WebP automatically.
// ─────────────────────────────────────────────────────────
const HERO_SLIDES = [
  {
    label: "NEW SEASON",
    headline: "Redefine\nYour Style",
    sub: "Premium fashion curated for the bold",
    bg: "linear-gradient(135deg,#0a0a0a 0%,#1a1a2e 100%)",
    accent: "#c9a84c",
    // Sharp-dressed man in navy suit, editorial feel
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=90&auto=format&fit=crop&crop=top",
    imgPosition: "center top",
  },
  {
    label: "PICK YOUR SCENT",
    headline: "Luxury\nPerfumes",
    sub: "Signature fragrances for every occasion",
    bg: "linear-gradient(135deg,#1a0810 0%,#2e0f22 100%)",
    accent: "#e8c5a0",
    // Elegant perfume bottle flat-lay on dark background
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=90&auto=format&fit=crop&crop=center",
    imgPosition: "center center",
  },
  {
    label: "STEP IN STYLE",
    headline: "Designer\nFootwear",
    sub: "Walk bold — shoes that make a statement",
    bg: "linear-gradient(135deg,#0a0f1a 0%,#0d1e38 100%)",
    accent: "#6ba3d6",
    // Clean white sneaker on minimal dark background
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=90&auto=format&fit=crop&crop=center",
    imgPosition: "center center",
  },
  {
    label: "WOMEN'S EDIT",
    headline: "Effortless\nElegance",
    sub: "Discover the new women's collection",
    bg: "linear-gradient(135deg,#160808 0%,#2e1010 100%)",
    accent: "#f5c6c6",
    // Fashion editorial — woman in elegant dress
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=90&auto=format&fit=crop&crop=top",
    imgPosition: "center top",
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [products, setProducts]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [sortBy, setSortBy]           = useState("Relevance");
  const [priceRange, setPriceRange]   = useState(5000);
  const [toast, setToast]             = useState(null);
  const [heroIdx, setHeroIdx]         = useState(0);
  const [heroAnim, setHeroAnim]       = useState(true);
  const [addingId, setAddingId]       = useState(null);
  const heroTimer = useRef(null);

  // ── hero auto-play ──
  const startTimer = () => {
    clearInterval(heroTimer.current);
    heroTimer.current = setInterval(() => {
      setHeroAnim(false);
      setTimeout(() => {
        setHeroIdx(i => (i + 1) % HERO_SLIDES.length);
        setHeroAnim(true);
      }, 350);
    }, 5000);
  };
  useEffect(() => { startTimer(); return () => clearInterval(heroTimer.current); }, []);

  const goSlide = (i) => {
    setHeroAnim(false);
    setTimeout(() => { setHeroIdx(i); setHeroAnim(true); }, 250);
    startTimer();
  };

  const showToast = (msg, color = "#16a34a") => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2500);
  };

  // ── fetch products ──
  useEffect(() => {
    fetch(`${API}/products`)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(data => { setProducts(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  // ── fetch wishlist ids ──
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
      const n = new Set(prev);
      isAdded ? n.delete(productId) : n.add(productId);
      return n;
    });
    try {
      if (isAdded) {
        await fetch(`${API}/wishlist/${productId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        showToast("Removed from Wishlist", "#6b7280");
      } else {
        await fetch(`${API}/wishlist`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
        showToast("❤️ Saved to Wishlist");
      }
    } catch {
      setWishlistIds(prev => {
        const n = new Set(prev);
        isAdded ? n.add(productId) : n.delete(productId);
        return n;
      });
      showToast("Something went wrong", "#dc2626");
    }
  }, [wishlistIds, navigate]);

  const addToBag = useCallback(async (e, product) => {
    e.stopPropagation();
    const token = getToken();
    if (!token) { navigate("/login"); return; }
    setAddingId(product.id);
    try {
      const r = await fetch(`${API}/products/${product.id}`, {
        headers: { Authorization: `Bearer ${token}`, "Cache-Control": "no-cache" },
      });
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
    } catch {
      showToast("Could not add to bag", "#dc2626");
    } finally {
      setAddingId(null);
    }
  }, [navigate]);

  // ── filter + sort (no category filter) ──
  let filtered = products.filter(p => (p.sale_price ?? p.base_price ?? 0) <= priceRange);
  if (sortBy === "Price: Low to High")
    filtered = [...filtered].sort((a, b) => (a.sale_price ?? a.base_price) - (b.sale_price ?? b.base_price));
  else if (sortBy === "Price: High to Low")
    filtered = [...filtered].sort((a, b) => (b.sale_price ?? b.base_price) - (a.sale_price ?? a.base_price));
  else if (sortBy === "Rating")
    filtered = [...filtered].sort((a, b) => b.rating - a.rating);

  const slide = HERO_SLIDES[heroIdx];

  return (
    <div style={{ minHeight: "100vh", background: "#f8f7f4" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Jost:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }

        /* ── cards ── */
        .card-hover { transition: transform .3s ease, box-shadow .3s ease; }
        .card-hover:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,.14) !important; }
        .product-card:hover .overlay-actions { opacity: 1 !important; }
        .product-card:hover .card-img { transform: scale(1.06); }
        .card-img { transition: transform .45s ease; }
        .heart-btn { transition: transform .2s ease !important; }
        .heart-btn:hover { transform: scale(1.2) !important; }
        .btn-dark:hover { background: #333 !important; }

        /* ── shimmer ── */
        .shimmer {
          background: linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%);
          background-size: 200%;
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer { 0%{background-position:200%} 100%{background-position:-200%} }

        /* ── hero text animation ── */
        @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        .slide-in-0 { animation: fadeUp .45s 0s   ease both; }
        .slide-in-1 { animation: fadeUp .45s .08s ease both; }
        .slide-in-2 { animation: fadeUp .45s .16s ease both; }

        /* ── range slider ── */
        .range-styled { -webkit-appearance:none; height:3px; border-radius:2px; outline:none; cursor:pointer; }
        .range-styled::-webkit-slider-thumb {
          -webkit-appearance:none; width:16px; height:16px; border-radius:50%;
          background:#c9a84c; cursor:pointer;
          box-shadow: 0 0 0 3px rgba(201,168,76,.2);
        }

        /* ── hero image panel ── */
        .dot-btn { transition: all .3s ease; border:none; cursor:pointer; padding:0; }
        .hero-img-wrap { overflow:hidden; }
        .hero-img-wrap img {
          width:100%; height:100%; object-fit:cover; display:block;
          transition: transform 7s ease, opacity .45s ease;
        }
        .hero-img-wrap:hover img { transform: scale(1.05); }
      `}</style>

      {/* ── TOAST ── */}
      {toast && (
        <div style={{
          position:"fixed", top:80, left:"50%", transform:"translateX(-50%)",
          background:toast.color, color:"#fff", padding:"11px 22px", borderRadius:5,
          zIndex:9999, fontSize:13, fontWeight:600, fontFamily:"'Jost',sans-serif",
          boxShadow:"0 8px 24px rgba(0,0,0,.2)", letterSpacing:".5px", whiteSpace:"nowrap",
        }}>
          {toast.msg}
        </div>
      )}

      {/* ════════════════════════════════════════
          HERO  — 420 px tall
      ════════════════════════════════════════ */}
      <div style={{
        position:"relative", height:420, overflow:"hidden",
        background:slide.bg, transition:"background .7s ease",
      }}>

        {/* subtle grid lines */}
        <div style={{
          position:"absolute", inset:0, pointerEvents:"none",
          backgroundImage:"repeating-linear-gradient(90deg,rgba(255,255,255,.025) 0,rgba(255,255,255,.025) 1px,transparent 1px,transparent 80px)",
        }} />

        {/* ── RIGHT photo ── */}
        <div
          className="hero-img-wrap"
          style={{
            position:"absolute", right:0, top:0,
            width:"52%", height:"100%",
            opacity: heroAnim ? 1 : 0,
            transition:"opacity .45s ease",
          }}
        >
          <img
            src={slide.image}
            alt={slide.label}
            style={{ objectPosition: slide.imgPosition }}
          />
          {/* gradient blend: left edge fades into dark bg */}
          <div style={{
            position:"absolute", inset:0, pointerEvents:"none",
            background:"linear-gradient(to right, rgba(5,5,10,.95) 0%, rgba(5,5,10,.35) 28%, transparent 58%)",
          }} />
          {/* bottom vignette */}
          <div style={{
            position:"absolute", inset:0, pointerEvents:"none",
            background:"linear-gradient(to top, rgba(0,0,0,.45) 0%, transparent 40%)",
          }} />
        </div>

        {/* glow behind photo */}
        <div style={{
          position:"absolute", right:"22%", top:"50%",
          transform:"translate(50%,-50%)",
          width:300, height:300, borderRadius:"50%",
          background:`radial-gradient(circle, ${slide.accent}1a 0%, transparent 70%)`,
          pointerEvents:"none", transition:"background .7s ease",
        }} />

        {/* ── LEFT text ── */}
        <div style={{
          position:"relative", zIndex:2, height:"100%",
          display:"flex", flexDirection:"column", justifyContent:"center",
          padding:"0 60px", maxWidth:530,
        }}>
          {heroAnim && (
            <>
              <p className="slide-in-0" style={{
                margin:"0 0 12px", color:slide.accent, fontSize:10,
                fontWeight:600, letterSpacing:4, textTransform:"uppercase",
                fontFamily:"'Jost',sans-serif",
              }}>
                {slide.label}
              </p>
              <h1 className="slide-in-1" style={{
                margin:"0 0 16px", color:"#fff", fontSize:56, fontWeight:900,
                lineHeight:1.06, whiteSpace:"pre-line",
                fontFamily:"'Playfair Display',serif",
                textShadow:"0 4px 28px rgba(0,0,0,.5)",
              }}>
                {slide.headline}
              </h1>
              <p className="slide-in-2" style={{
                margin:0, color:"rgba(255,255,255,.52)", fontSize:14,
                fontFamily:"'Jost',sans-serif", fontWeight:300, letterSpacing:.5,
              }}>
                {slide.sub}
              </p>
            </>
          )}
        </div>

        {/* dot nav */}
        <div style={{ position:"absolute", bottom:24, left:60, display:"flex", gap:8, zIndex:3 }}>
          {HERO_SLIDES.map((_, i) => (
            <button key={i} className="dot-btn" onClick={() => goSlide(i)}
              style={{
                width: i === heroIdx ? 28 : 8, height:8, borderRadius:4,
                background: i === heroIdx ? slide.accent : "rgba(255,255,255,.25)",
              }} />
          ))}
        </div>

        {/* slide counter */}
        <div style={{
          position:"absolute", bottom:28, right:60,
          color:"rgba(255,255,255,.22)", fontSize:11,
          letterSpacing:3, fontFamily:"'Jost',sans-serif",
        }}>
          0{heroIdx + 1} / 0{HERO_SLIDES.length}
        </div>
      </div>

      {/* ════════════════════════════════════════
          FILTER BAR  (category tabs removed)
      ════════════════════════════════════════ */}
      <div style={{
        background:"#fff", borderBottom:"1px solid #ebebeb",
        padding:"13px 40px", display:"flex", alignItems:"center", gap:20,
      }}>
        {/* sort dropdown */}
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          style={{
            border:"none", background:"transparent", fontSize:11,
            color:"#666", cursor:"pointer", outline:"none",
            letterSpacing:1, textTransform:"uppercase",
            fontFamily:"'Jost',sans-serif", fontWeight:500,
          }}>
          {sortOptions.map(o => <option key={o}>{o}</option>)}
        </select>

        <div style={{ width:1, height:18, background:"#e5e5e5" }} />

        <span style={{ fontSize:11, color:"#bbb", fontFamily:"'Jost',sans-serif", letterSpacing:1 }}>
          {loading ? "Loading…" : `${filtered.length} ${filtered.length === 1 ? "product" : "products"}`}
        </span>

        {/* price slider */}
        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:12 }}>
          <span style={{
            fontSize:11, color:"#aaa", letterSpacing:1,
            textTransform:"uppercase", fontFamily:"'Jost',sans-serif",
          }}>
            Max Price
          </span>
          <input type="range" min="100" max="5000" value={priceRange}
            onChange={e => setPriceRange(Number(e.target.value))}
            className="range-styled"
            style={{
              width:130,
              background:`linear-gradient(to right,#c9a84c ${((priceRange - 100) / 4900) * 100}%,#e0e0e0 0%)`,
            }} />
          <span style={{
            fontSize:13, fontWeight:600, color:"#1a1a1a",
            fontFamily:"'Jost',sans-serif", minWidth:60,
          }}>
            ₹{priceRange.toLocaleString()}
          </span>
        </div>
      </div>

      {/* ════════════════════════════════════════
          PRODUCT GRID
      ════════════════════════════════════════ */}
      <div style={{ padding:"36px 40px 80px" }}>

        {/* section header */}
        <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:28 }}>
          <h2 style={{
            margin:0, fontSize:24, fontWeight:700,
            color:"#1a1a1a", fontFamily:"'Playfair Display',serif",
          }}>
            All Products
          </h2>
          <div style={{ flex:1, height:1, background:"linear-gradient(to right,#e0e0e0,transparent)" }} />
        </div>

        {/* skeleton */}
        {loading && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))", gap:22 }}>
            {[1, 2, 3, 4].map(i => (
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

        {error && (
          <p style={{ color:"#dc2626", fontFamily:"'Jost',sans-serif" }}>⚠️ {error}</p>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign:"center", padding:"70px 20px" }}>
            <div style={{ fontSize:52 }}>🔍</div>
            <p style={{ color:"#888", fontFamily:"'Jost',sans-serif", fontSize:14, marginTop:12 }}>
              No products found
            </p>
            <button onClick={() => setPriceRange(5000)}
              style={{
                marginTop:14, padding:"11px 26px", background:"#1a1a1a",
                color:"#fff", border:"none", borderRadius:3, cursor:"pointer",
                fontSize:11, letterSpacing:2, textTransform:"uppercase",
                fontFamily:"'Jost',sans-serif",
              }}>
              Reset Filter
            </button>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))", gap:22 }}>
            {filtered.map(product => {
              const imgUrl    = getPrimaryImage(product.media);
              const salePrice = product.sale_price ?? null;
              const basePrice = product.base_price ?? 0;
              const pct       = basePrice && salePrice
                ? Math.round(((basePrice - salePrice) / basePrice) * 100) : 0;
              const inWish    = wishlistIds.has(product.id);
              const isAdding  = addingId === product.id;

              return (
                <div key={product.id} className="card-hover product-card"
                  onClick={() => navigate(`/product/${product.id}`)}
                  style={{
                    background:"#fff", borderRadius:8, overflow:"hidden",
                    cursor:"pointer", position:"relative",
                    boxShadow:"0 2px 10px rgba(0,0,0,.06)",
                  }}>

                  {/* image */}
                  <div style={{ position:"relative", height:290, background:"#f5f4f0", overflow:"hidden" }}>
                    {imgUrl
                      ? <img src={imgUrl} alt={product.title} className="card-img"
                          style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
                          onError={e => { e.target.style.display = "none"; }} />
                      : <div style={{ height:"100%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:52 }}>🛍️</div>
                    }

                    {pct > 0 && (
                      <div style={{
                        position:"absolute", top:11, left:11,
                        background:"#e11d48", color:"#fff", fontSize:10,
                        fontWeight:700, padding:"3px 7px", borderRadius:2,
                        letterSpacing:1, fontFamily:"'Jost',sans-serif",
                      }}>
                        {pct}% OFF
                      </div>
                    )}

                    {/* hover overlay */}
                    <div className="overlay-actions" style={{
                      position:"absolute", inset:0, background:"rgba(0,0,0,.22)",
                      display:"flex", alignItems:"flex-end", justifyContent:"center",
                      padding:"0 14px 14px", opacity:0, transition:"opacity .25s ease",
                    }}>
                      <button onClick={e => addToBag(e, product)} disabled={isAdding}
                        style={{
                          width:"100%", padding:"11px 0", background:"#fff",
                          color:"#1a1a1a", border:"none", borderRadius:3, fontSize:10,
                          fontWeight:700, cursor:"pointer", letterSpacing:2,
                          textTransform:"uppercase", fontFamily:"'Jost',sans-serif",
                          display:"flex", alignItems:"center", justifyContent:"center", gap:6,
                        }}>
                        <BagIcon /> {isAdding ? "Adding…" : "Add to Bag"}
                      </button>
                    </div>

                    {/* wishlist */}
                    <button className="heart-btn" onClick={e => toggleWishlist(e, product.id)}
                      style={{
                        position:"absolute", top:11, right:11,
                        background: inWish ? "rgba(225,29,72,.12)" : "rgba(255,255,255,.88)",
                        border:"none", borderRadius:"50%", width:35, height:35,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        cursor:"pointer", backdropFilter:"blur(4px)",
                        boxShadow:"0 2px 8px rgba(0,0,0,.14)",
                      }}>
                      <HeartIcon filled={inWish} />
                    </button>
                  </div>

                  {/* info */}
                  <div style={{ padding:"14px 16px 18px" }}>
                    <p style={{
                      margin:"0 0 3px", fontSize:10, color:"#c9a84c",
                      fontWeight:600, letterSpacing:2, textTransform:"uppercase",
                      fontFamily:"'Jost',sans-serif",
                    }}>
                      {product.brand}
                    </p>
                    <h4 style={{
                      margin:"0 0 10px", fontSize:14, fontWeight:400,
                      color:"#1a1a1a", lineHeight:1.4,
                      fontFamily:"'Playfair Display',serif",
                      whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis",
                    }}>
                      {product.title}
                    </h4>

                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
                      <div style={{ display:"flex", alignItems:"baseline", gap:7 }}>
                        <span style={{ fontSize:16, fontWeight:700, color:"#1a1a1a", fontFamily:"'Jost',sans-serif" }}>
                          ₹{(salePrice ?? basePrice).toLocaleString()}
                        </span>
                        {salePrice && (
                          <span style={{ fontSize:11, color:"#c0b9b9", textDecoration:"line-through", fontFamily:"'Jost',sans-serif" }}>
                            ₹{basePrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <div style={{
                        display:"flex", alignItems:"center", gap:3,
                        background:"#f8f7f4", padding:"3px 8px", borderRadius:12,
                      }}>
                        <span style={{ color:"#c9a84c" }}><StarIcon /></span>
                        <span style={{ fontSize:11, fontWeight:600, color:"#555", fontFamily:"'Jost',sans-serif" }}>
                          {Number(product.rating).toFixed(1)}
                        </span>
                        <span style={{ fontSize:10, color:"#bbb", fontFamily:"'Jost',sans-serif" }}>
                          ({product.review_count})
                        </span>
                      </div>
                    </div>

                    <button onClick={e => addToBag(e, product)} disabled={isAdding} className="btn-dark"
                      style={{
                        width:"100%", padding:"10px 0", background:"#1a1a1a",
                        color:"#fff", border:"none", borderRadius:3, fontSize:10,
                        fontWeight:600, cursor:"pointer", letterSpacing:2,
                        textTransform:"uppercase", fontFamily:"'Jost',sans-serif",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        gap:7, transition:"background .2s",
                      }}>
                      <BagIcon /> {isAdding ? "Adding…" : "Add to Bag"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════ */}
      {/* <div style={{
        background:"#1a1a1a", padding:"36px 40px",
        display:"flex", gap:32, flexWrap:"wrap",
        alignItems:"center", justifyContent:"space-between",
      }}>
        {[
          { icon:"🚚", title:"Free Delivery",   sub:"On orders above ₹999" },
          { icon:"↩️", title:"Easy Returns",    sub:"30-day return policy" },
          { icon:"🔒", title:"Secure Payment",  sub:"100% safe checkout" },
          { icon:"✨", title:"Premium Quality", sub:"Curated fashion brands" },
        ].map(f => (
          <div key={f.title} style={{ display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ fontSize:26 }}>{f.icon}</span>
            <div>
              <p style={{ margin:0, color:"#fff", fontSize:12, fontWeight:600, fontFamily:"'Jost',sans-serif" }}>
                {f.title}
              </p>
              <p style={{ margin:0, color:"rgba(255,255,255,.38)", fontSize:11, fontFamily:"'Jost',sans-serif" }}>
                {f.sub}
              </p>
            </div>
          </div>
        ))}
      </div> */}
    </div>
  );
}