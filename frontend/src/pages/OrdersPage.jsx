import { useState } from "react";
import { API_URL } from "../config/api";

const API = API_URL;

const money = (n) => `Rs ${Number(n || 0).toLocaleString("en-IN")}`;

function StatusChip({ status }) {
  const s = String(status || "processing").toLowerCase();
  const palette = {
    delivered: { bg: "#e7f8ef", fg: "#0d7a3d" },
    shipped: { bg: "#e8f2ff", fg: "#1b5dbf" },
    out_for_delivery: { bg: "#fff4db", fg: "#a86900" },
    placed: { bg: "#f4f4f5", fg: "#3f3f46" },
    confirmed: { bg: "#f4f4f5", fg: "#3f3f46" },
    processing: { bg: "#f4f4f5", fg: "#3f3f46" },
    cancelled: { bg: "#feecec", fg: "#c53131" },
    canceled: { bg: "#feecec", fg: "#c53131" },
  };

  const p = palette[s] || palette.processing;
  return (
    <span
      style={{
        background: p.bg,
        color: p.fg,
        borderRadius: 999,
        padding: "5px 10px",
        fontSize: 12,
        fontWeight: 700,
        textTransform: "capitalize",
      }}
    >
      {s.replace(/_/g, " ")}
    </span>
  );
}

export default function TrackOrders() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);

  const onTrack = async () => {
    const q = query.trim();
    if (!q) {
      setError("Please enter Tracking ID / Order ID / Product Variant ID");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login first to track your order");
        setItems([]);
        return;
      }

      const r = await fetch(`${API}/user/track?q=${encodeURIComponent(q)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await r.json();
      if (!r.ok) {
        setError(data.message || "Unable to track order");
        setItems([]);
        return;
      }

      setItems(Array.isArray(data.items) ? data.items : []);
    } catch (e) {
      setError("Something went wrong while tracking your order");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 980, margin: "30px auto", padding: "0 16px 30px" }}>
      <div
        style={{
          background: "#fff",
          border: "1px solid #ececec",
          borderRadius: 14,
          padding: 18,
          boxShadow: "0 2px 10px rgba(0,0,0,.04)",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 24, color: "#1d1d1d" }}>Track Your Order</h1>
        <p style={{ margin: "8px 0 16px", color: "#666", fontSize: 14 }}>
          Enter tracking number, order number, order id, or product variant id.
        </p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onTrack()}
            placeholder="Example: TRK12345 / ORD-001 / 1023"
            style={{
              flex: 1,
              minWidth: 240,
              border: "1.5px solid #ddd",
              borderRadius: 10,
              padding: "11px 13px",
              fontSize: 14,
              outline: "none",
            }}
          />
          <button
            onClick={onTrack}
            disabled={loading}
            style={{
              border: "none",
              background: "#111",
              color: "#fff",
              borderRadius: 10,
              padding: "11px 18px",
              fontSize: 14,
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Tracking..." : "Track"}
          </button>
        </div>

        {error && <p style={{ color: "#c53131", marginTop: 10, fontSize: 13 }}>{error}</p>}
      </div>

      {!loading && items.length === 0 && !error && (
        <div style={{ textAlign: "center", color: "#888", marginTop: 22, fontSize: 14 }}>
          No tracking data yet. Search above to see shipment details.
        </div>
      )}

      <div style={{ marginTop: 18, display: "grid", gap: 14 }}>
        {items.map((it) => (
          <div
            key={`${it.orderItemId}-${it.trackingNumber || "na"}`}
            style={{
              background: "#fff",
              border: "1px solid #ececec",
              borderRadius: 14,
              padding: 16,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a" }}>{it.productTitle || "Product"}</div>
                <div style={{ fontSize: 13, color: "#666", marginTop: 3 }}>
                  Order #{it.orderNumber || it.orderId} · Variant #{it.variantId}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <StatusChip status={it.status} />
                <div style={{ fontSize: 13, color: "#666", marginTop: 6 }}>
                  Qty {it.quantity} · {money(it.totalPrice || it.unitPrice)}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 12, fontSize: 13, color: "#444" }}>
              <div>Tracking ID: <strong>{it.trackingNumber || "Not Assigned Yet"}</strong></div>
              <div>Expected Delivery: <strong>{it.expectedDelivery ? new Date(it.expectedDelivery).toLocaleDateString() : "Updating Soon"}</strong></div>
            </div>

            <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
              {Array.isArray(it.steps) && it.steps.map((s) => (
                <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: s.done ? "#16a34a" : "#e5e7eb",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {s.done ? "✓" : ""}
                  </div>
                  <span style={{ fontSize: 13, color: s.done ? "#111" : "#888", fontWeight: s.done ? 600 : 500 }}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}