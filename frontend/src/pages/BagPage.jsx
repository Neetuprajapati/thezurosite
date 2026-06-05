// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import theme from "./theme";

// const API = API_URL;
// const getToken = () => localStorage.getItem("token");

// export default function BagPage() {
//   const navigate = useNavigate();
//   const [items, setItems]     = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [toast, setToast]     = useState(null);

//   const showToast = (msg, color = "#16a34a") => {
//     setToast({ msg, color });
//     setTimeout(() => setToast(null), 2500);
//   };

//   const fetchBag = () => {
//     const token = getToken();
//     if (!token) { navigate("/login"); return; }
//     fetch(`${API}/bag`, { headers: { Authorization: `Bearer ${token}` } })
//       .then(r => r.json())
//       .then(data => { setItems(Array.isArray(data) ? data : []); setLoading(false); })
//       .catch(() => setLoading(false));
//   };

//   useEffect(() => { fetchBag(); }, []);

//   const updateQty = async (itemId, newQty) => {
//     if (newQty < 1) return removeItem(itemId);
//     const token = getToken();
//     await fetch(`${API}/bag/${itemId}`, {
//       method: "PATCH",
//       headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//       body: JSON.stringify({ quantity: newQty })
//     });
//     setItems(prev => prev.map(i => i.id === itemId ? { ...i, quantity: newQty } : i));
//   };

//   const removeItem = async (itemId) => {
//     const token = getToken();
//     await fetch(`${API}/bag/${itemId}`, {
//       method: "DELETE", headers: { Authorization: `Bearer ${token}` }
//     });
//     setItems(prev => prev.filter(i => i.id !== itemId));
//     showToast("Removed from Bag", "#6b7280");
//   };

//   const subtotal = items.reduce((sum, i) => sum + ((i.sale_price ?? i.base_price) * i.quantity), 0);
//   const shipping  = subtotal > 999 ? 0 : 99;
//   const total     = subtotal + shipping;

//   if (loading) return <p style={{ padding: 40, textAlign: "center" }}>Loading bag…</p>;

//   return (
//     <div style={{ minHeight: "100vh", background: theme.bg, padding: 20 }}>

//       {toast && (
//         <div style={{
//           position: "fixed", top: 80, left: "50%", transform: "translateX(-50%)",
//           background: toast.color, color: "#fff", padding: "10px 20px",
//           borderRadius: 8, zIndex: 9999, fontSize: 14, fontWeight: 600,
//           boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
//         }}>{toast.msg}</div>
//       )}

//       <h2 style={{ margin: "0 0 20px", fontSize: 22, fontWeight: 700 }}>My Bag ({items.length})</h2>

//       {items.length === 0 ? (
//         <div style={{ textAlign: "center", padding: "60px 20px" }}>
//           <div style={{ fontSize: 60 }}>🛒</div>
//           <p style={{ color: "#888", marginTop: 12 }}>Your bag is empty</p>
//           <button onClick={() => navigate("/home")} style={{ marginTop: 16, padding: "10px 24px", background: theme.primary, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>
//             Shop Now
//           </button>
//         </div>
//       ) : (
//         <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "flex-start" }}>

//           {/* ITEMS */}
//           <div style={{ flex: 1, minWidth: 300, display: "flex", flexDirection: "column", gap: 12 }}>
//             {items.map(item => (
//               <div key={item.id} style={{ background: "#fff", borderRadius: 12, padding: 14, display: "flex", gap: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>

//                 {/* IMAGE */}
//                 <div style={{ width: 90, height: 100, borderRadius: 8, overflow: "hidden", background: "#f5f5f5", flexShrink: 0 }}>
//                   {item.image_url
//                     ? <img src={item.image_url} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
//                     : <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>🛍️</div>
//                   }
//                 </div>

//                 {/* INFO */}
//                 <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
//                   <p style={{ margin: 0, fontSize: 11, color: "#aaa", textTransform: "uppercase" }}>{item.brand}</p>
//                   <h4 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{item.title}</h4>
//                   {item.attributes && Object.keys(item.attributes).length > 0 && (
//                     <p style={{ margin: 0, fontSize: 12, color: "#888" }}>
//                       {Object.entries(item.attributes).map(([k,v]) => `${k}: ${v}`).join(", ")}
//                     </p>
//                   )}
//                   <b style={{ fontSize: 15 }}>₹{item.sale_price ?? item.base_price}</b>

//                   {/* QTY CONTROLS */}
//                   <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
//                     <button onClick={() => updateQty(item.id, item.quantity - 1)}
//                       style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid #ddd", background: "#f5f5f5", cursor: "pointer", fontSize: 16, fontWeight: 700 }}>−</button>
//                     <span style={{ fontSize: 14, fontWeight: 600, minWidth: 20, textAlign: "center" }}>{item.quantity}</span>
//                     <button onClick={() => updateQty(item.id, item.quantity + 1)}
//                       style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid #ddd", background: "#f5f5f5", cursor: "pointer", fontSize: 16, fontWeight: 700 }}>+</button>

//                     <button onClick={() => removeItem(item.id)}
//                       style={{ marginLeft: "auto", background: "none", border: "none", color: "#e11d48", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
//                       Remove
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* ORDER SUMMARY */}
//           <div style={{ width: 280, background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.07)", position: "sticky", top: 80 }}>
//             <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700 }}>Order Summary</h3>

//             <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 14 }}>
//               <div style={{ display: "flex", justifyContent: "space-between" }}>
//                 <span style={{ color: "#666" }}>Subtotal ({items.length} items)</span>
//                 <span>₹{subtotal.toFixed(2)}</span>
//               </div>
//               <div style={{ display: "flex", justifyContent: "space-between" }}>
//                 <span style={{ color: "#666" }}>Shipping</span>
//                 <span style={{ color: shipping === 0 ? "#16a34a" : "#111" }}>
//                   {shipping === 0 ? "FREE" : `₹${shipping}`}
//                 </span>
//               </div>
//               {shipping > 0 && (
//                 <p style={{ margin: 0, fontSize: 12, color: "#16a34a" }}>
//                   Add ₹{(999 - subtotal).toFixed(0)} more for free shipping!
//                 </p>
//               )}
//               <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "4px 0" }} />
//               <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 16 }}>
//                 <span>Total</span>
//                 <span>₹{total.toFixed(2)}</span>
//               </div>
//             </div>

//             <button style={{
//               marginTop: 20, width: "100%", padding: "12px 0",
//               background: theme.primary, color: "#fff", border: "none",
//               borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 15
//             }}>
//               Place Order
//             </button>

//             <button onClick={() => navigate("/home")} style={{
//               marginTop: 10, width: "100%", padding: "10px 0",
//               background: "none", color: theme.primary, border: `1px solid ${theme.primary}`,
//               borderRadius: 10, cursor: "pointer", fontWeight: 600, fontSize: 14
//             }}>
//               Continue Shopping
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
// ─── BagPage.jsx  (updated — Place Order navigates to /checkout) ──────────────
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import theme from "./theme";
import { API_URL } from "../config/api";

const API = API_URL;
const getToken = () => localStorage.getItem("token");

export default function BagPage() {
  const navigate = useNavigate();
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast]     = useState(null);

  const showToast = (msg, color = "#16a34a") => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2500);
  };

  const fetchBag = () => {
    const token = getToken();
    if (!token) { navigate("/login"); return; }
    fetch(`${API}/bag`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { setItems(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchBag(); }, []);

  const updateQty = async (itemId, newQty) => {
    if (newQty < 1) return removeItem(itemId);
    const token = getToken();
    await fetch(`${API}/bag/${itemId}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: newQty })
    });
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, quantity: newQty } : i));
  };

  const removeItem = async (itemId) => {
    const token = getToken();
    await fetch(`${API}/bag/${itemId}`, {
      method: "DELETE", headers: { Authorization: `Bearer ${token}` }
    });
    setItems(prev => prev.filter(i => i.id !== itemId));
    showToast("Removed from Bag", "#6b7280");
  };

  const subtotal = items.reduce((sum, i) => sum + ((i.sale_price ?? i.base_price) * i.quantity), 0);
  const shipping  = subtotal > 999 ? 0 : 99;
  const total     = subtotal + shipping;

  // ── Navigate to checkout (validates bag is not empty) ────────────────────
  const handlePlaceOrder = () => {
    if (items.length === 0) return;
    navigate("/checkout");
  };

  if (loading) return <p style={{ padding: 40, textAlign: "center" }}>Loading bag…</p>;

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, padding: 20 }}>

      {toast && (
        <div style={{
          position: "fixed", top: 80, left: "50%", transform: "translateX(-50%)",
          background: toast.color, color: "#fff", padding: "10px 20px",
          borderRadius: 8, zIndex: 9999, fontSize: 14, fontWeight: 600,
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
        }}>{toast.msg}</div>
      )}

      <h2 style={{ margin: "0 0 20px", fontSize: 22, fontWeight: 700 }}>My Bag ({items.length})</h2>

      {items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{ fontSize: 60 }}>🛒</div>
          <p style={{ color: "#888", marginTop: 12 }}>Your bag is empty</p>
          <button onClick={() => navigate("/home")} style={{ marginTop: 16, padding: "10px 24px", background: theme.primary, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>
            Shop Now
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "flex-start" }}>

          {/* ITEMS */}
          <div style={{ flex: 1, minWidth: 300, display: "flex", flexDirection: "column", gap: 12 }}>
            {items.map(item => (
              <div key={item.id} style={{ background: "#fff", borderRadius: 12, padding: 14, display: "flex", gap: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>

                {/* IMAGE */}
                <div style={{ width: 90, height: 100, borderRadius: 8, overflow: "hidden", background: "#f5f5f5", flexShrink: 0 }}>
                  {item.image_url
                    ? <img src={item.image_url} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>🛍️</div>
                  }
                </div>

                {/* INFO */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                  <p style={{ margin: 0, fontSize: 11, color: "#aaa", textTransform: "uppercase" }}>{item.brand}</p>
                  <h4 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{item.title}</h4>
                  {item.attributes && Object.keys(item.attributes).length > 0 && (
                    <p style={{ margin: 0, fontSize: 12, color: "#888" }}>
                      {Object.entries(item.attributes).map(([k,v]) => `${k}: ${v}`).join(", ")}
                    </p>
                  )}
                  <b style={{ fontSize: 15 }}>₹{item.sale_price ?? item.base_price}</b>

                  {/* QTY CONTROLS */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
                    <button onClick={() => updateQty(item.id, item.quantity - 1)}
                      style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid #ddd", background: "#f5f5f5", cursor: "pointer", fontSize: 16, fontWeight: 700 }}>−</button>
                    <span style={{ fontSize: 14, fontWeight: 600, minWidth: 20, textAlign: "center" }}>{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, item.quantity + 1)}
                      style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid #ddd", background: "#f5f5f5", cursor: "pointer", fontSize: 16, fontWeight: 700 }}>+</button>

                    <button onClick={() => removeItem(item.id)}
                      style={{ marginLeft: "auto", background: "none", border: "none", color: "#e11d48", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ORDER SUMMARY */}
          <div style={{ width: 280, background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.07)", position: "sticky", top: 80 }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700 }}>Order Summary</h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#666" }}>Subtotal ({items.length} items)</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#666" }}>Shipping</span>
                <span style={{ color: shipping === 0 ? "#16a34a" : "#111" }}>
                  {shipping === 0 ? "FREE" : `₹${shipping}`}
                </span>
              </div>
              {shipping > 0 && (
                <p style={{ margin: 0, fontSize: 12, color: "#16a34a" }}>
                  Add ₹{(999 - subtotal).toFixed(0)} more for free shipping!
                </p>
              )}
              <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "4px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 16 }}>
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            {/* ✅ UPDATED: navigates to /checkout */}
            <button
              onClick={handlePlaceOrder}
              style={{
                marginTop: 20, width: "100%", padding: "12px 0",
                background: theme.primary, color: "#fff", border: "none",
                borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 15
              }}>
              Place Order
            </button>

            <button onClick={() => navigate("/home")} style={{
              marginTop: 10, width: "100%", padding: "10px 0",
              background: "none", color: theme.primary, border: `1px solid ${theme.primary}`,
              borderRadius: 10, cursor: "pointer", fontWeight: 600, fontSize: 14
            }}>
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}