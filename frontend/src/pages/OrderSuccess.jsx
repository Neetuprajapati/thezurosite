import { useLocation, useNavigate } from "react-router-dom";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const orderId = state?.orderId || "-";
  const status = state?.status || "success";
  const method = state?.method || "cod";
  const isSuccess = status === "success";

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f8f8", padding: 16 }}>
      <div style={{ width: "100%", maxWidth: 560, background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 6px 24px rgba(0,0,0,.08)", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 10 }}>{isSuccess ? "✅" : "❌"}</div>
        <h1 style={{ margin: 0, fontSize: 24, color: "#111" }}>
          {isSuccess ? "Order Confirmed" : "Payment Failed"}
        </h1>
        <p style={{ margin: "10px 0 0", color: "#666", fontSize: 14 }}>
          {isSuccess
            ? "Your order has been placed successfully."
            : "Your payment did not complete. You can retry checkout."}
        </p>

        <div style={{ marginTop: 16, padding: 14, border: "1px solid #eee", borderRadius: 10, background: "#fafafa", textAlign: "left" }}>
          <p style={{ margin: "0 0 6px", fontSize: 13, color: "#444" }}>
            <strong>Order ID:</strong> {orderId}
          </p>
          <p style={{ margin: "0 0 6px", fontSize: 13, color: "#444" }}>
            <strong>Payment Method:</strong> {String(method).toUpperCase()}
          </p>
          <p style={{ margin: 0, fontSize: 13, color: "#444" }}>
            <strong>Status:</strong> {isSuccess ? "Success" : "Failed"}
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 20, flexWrap: "wrap" }}>
          <button
            onClick={() => navigate("/track-orders")}
            style={{ border: "none", background: "#111", color: "#fff", borderRadius: 10, padding: "10px 14px", fontWeight: 700, cursor: "pointer" }}
          >
            Track Order
          </button>
          {!isSuccess && (
            <button
              onClick={() => navigate("/checkout", { state: { startStep: 2 } })}
              style={{ border: "1px solid #111", background: "#fff", color: "#111", borderRadius: 10, padding: "10px 14px", fontWeight: 700, cursor: "pointer" }}
            >
              Retry Payment
            </button>
          )}
          <button
            onClick={() => navigate("/home")}
            style={{ border: "1px solid #ddd", background: "#fff", color: "#333", borderRadius: 10, padding: "10px 14px", fontWeight: 700, cursor: "pointer" }}
          >
            Back To Home
          </button>
        </div>
      </div>
    </div>
  );
}
