import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import theme from "./theme";
import { API_URL } from "../config/api";

const API = API_URL;
const getToken = () => localStorage.getItem("token");

const StarIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="#fff">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

export default function WishlistPage() {
  const navigate = useNavigate();
  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast]   = useState(null);

  const showToast = (msg, color = "#16a34a") => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2500);
  };

  const fetchWishlist = () => {
    const token = getToken();
    // if (!token) { navigate("/login"); return; }
    if (!token) {
      setItems([]);
      setLoading(false);
      return;
    }

    fetch(`${API}/wishlist`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { setItems(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchWishlist(); }, []);

  const removeItem = async (productId) => {
    const token = getToken();
    try {
      await fetch(`${API}/wishlist/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(prev => prev.filter(i => i.product_id !== productId));
      showToast("Removed from Wishlist", "#6b7280");
    } catch {
      showToast("Failed to remove", "#dc2626");
    }
  };

  const addToBag = async (item) => {
    const token = getToken();
    try {
      // get first variant
      const r  = await fetch(`${API}/products/${item.product_id}`);
      const p  = await r.json();
      const variantId = p.variants?.[0]?.id;
      if (!variantId) { showToast("No variant available", "#dc2626"); return; }

      await fetch(`${API}/bag`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ variantId, quantity: 1 })
      });
      showToast("🛒 Added to Bag!");
    } catch {
      showToast("Could not add to bag", "#dc2626");
    }
  };

  if (loading) return <p style={{ padding: 40, textAlign: "center" }}>Loading wishlist…</p>;

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, padding: "20px" }}>

      {toast && (
        <div style={{
          position: "fixed", top: 80, left: "50%", transform: "translateX(-50%)",
          background: toast.color, color: "#fff", padding: "10px 20px",
          borderRadius: 8, zIndex: 9999, fontSize: 14, fontWeight: 600,
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
        }}>{toast.msg}</div>
      )}

      <h2 style={{ margin: "0 0 20px", fontSize: 22, fontWeight: 700 }}>
        My Wishlist ({items.length})
      </h2>

      {items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{ fontSize: 60 }}>🤍</div>
          <p style={{ color: "#888", marginTop: 12 }}>Your wishlist is empty</p>
          <button
            onClick={() => navigate("/home")}
            style={{ marginTop: 16, padding: "10px 24px", background: theme.primary, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}
          >
            Shop Now
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
          {items.map(item => {
            const salePrice = item.sale_price ?? null;
            const basePrice = item.base_price ?? 0;
            const pct = basePrice && salePrice ? Math.round(((basePrice - salePrice) / basePrice) * 100) : 0;

            return (
              <div key={item.id} style={{
                background: "#fff", borderRadius: 12, overflow: "hidden",
                boxShadow: "0 2px 10px rgba(0,0,0,0.08)", display: "flex", flexDirection: "column"
              }}>
                {/* IMAGE */}
                <div style={{ position: "relative", height: 190, background: "#f5f5f5", cursor: "pointer" }}
                  onClick={() => navigate(`/product/${item.product_id}`)}>
                  {item.image_url
                    ? <img src={item.image_url} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>🛍️</div>
                  }
                  {pct > 0 && (
                    <span style={{ position: "absolute", top: 8, left: 8, background: "#e11d48", color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 4 }}>
                      {pct}% OFF
                    </span>
                  )}
                  {/* remove button */}
                  <button
                    onClick={e => { e.stopPropagation(); removeItem(item.product_id); }}
                    style={{
                      position: "absolute", top: 8, right: 8,
                      background: "#fff", border: "none", borderRadius: "50%",
                      width: 30, height: 30, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.15)", fontSize: 14
                    }}
                    title="Remove"
                  >✕</button>
                </div>

                {/* DETAILS */}
                <div style={{ padding: "10px 12px 14px", flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                  <p style={{ margin: 0, fontSize: 11, color: "#aaa", textTransform: "uppercase" }}>{item.brand}</p>
                  <h4 style={{ margin: 0, fontSize: 14, fontWeight: 600, lineHeight: 1.3, color: "#111" }}>{item.title}</h4>

                  <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                    <span style={{ background: "#16a34a", color: "#fff", padding: "2px 6px", borderRadius: 4, fontSize: 12, display: "flex", alignItems: "center", gap: 3 }}>
                      {Number(item.rating || 0).toFixed(1)} <StarIcon />
                    </span>
                    <span style={{ fontSize: 11, color: "#bbb" }}>({item.review_count || 0})</span>
                  </div>

                  <div style={{ marginTop: 4, display: "flex", alignItems: "baseline", gap: 6 }}>
                    <b style={{ fontSize: 15 }}>₹{salePrice ?? basePrice}</b>
                    {salePrice && <span style={{ textDecoration: "line-through", color: "#bbb", fontSize: 12 }}>₹{basePrice}</span>}
                  </div>

                  <button
                    onClick={() => addToBag(item)}
                    style={{ marginTop: 8, padding: "9px 0", border: "none", background: theme.primary, color: "#fff", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 13 }}
                  >
                    Move to Bag 🛒
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}