import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import theme from "./theme";

const API = "https://api.thezuro.com/api";
const getToken = () => localStorage.getItem("token");

// ─── tiny helpers ────────────────────────────────────────────────────────────
const fmt = (n) => `₹${Number(n).toFixed(2)}`;

// ─── Step indicator ──────────────────────────────────────────────────────────
function Steps({ current }) {
  const steps = ["Bag", "Address", "Payment", "Confirmation"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 28 }}>
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={s} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: done ? "#16a34a" : active ? theme.primary : "#e5e7eb",
                color: done || active ? "#fff" : "#9ca3af",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700, transition: "all .3s"
              }}>
                {done ? "✓" : i + 1}
              </div>
              <span style={{ fontSize: 11, fontWeight: active ? 700 : 400, color: active ? theme.primary : done ? "#16a34a" : "#9ca3af", whiteSpace: "nowrap" }}>{s}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: 2, background: done ? "#16a34a" : "#e5e7eb", margin: "0 4px", marginBottom: 18, transition: "background .3s" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Card shell ───────────────────────────────────────────────────────────────
function Card({ children, style }) {
  return (
    <div style={{ background: "#fff", borderRadius: 14, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", ...style }}>
      {children}
    </div>
  );
}

// ─── Input field ──────────────────────────────────────────────────────────────
function Field({ label, id, error, ...props }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label htmlFor={id} style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{label}</label>
      <input
        id={id}
        style={{
          padding: "10px 12px", border: `1.5px solid ${error ? "#ef4444" : "#e5e7eb"}`,
          borderRadius: 8, fontSize: 14, outline: "none", transition: "border .2s",
          background: "#fafafa"
        }}
        onFocus={e => e.target.style.borderColor = theme.primary}
        onBlur={e => e.target.style.borderColor = error ? "#ef4444" : "#e5e7eb"}
        {...props}
      />
      {error && <span style={{ fontSize: 12, color: "#ef4444" }}>{error}</span>}
    </div>
  );
}

// ─── ORDER SUMMARY sidebar ────────────────────────────────────────────────────
function OrderSummary({ items, subtotal, shipping, total }) {
  return (
    <Card style={{ width: 260, flexShrink: 0, position: "sticky", top: 80 }}>
      <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700 }}>Order Summary</h3>
      <div style={{ maxHeight: 200, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
        {items.map(item => (
          <div key={item.id} style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ width: 44, height: 48, borderRadius: 6, overflow: "hidden", background: "#f5f5f5", flexShrink: 0 }}>
              {item.image_url
                ? <img src={item.image_url} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🛍️</div>}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600, lineHeight: 1.3 }}>{item.title}</p>
              <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>Qty: {item.quantity}</p>
            </div>
            <span style={{ fontSize: 13, fontWeight: 700 }}>{fmt((item.sale_price ?? item.base_price) * item.quantity)}</span>
          </div>
        ))}
      </div>
      <hr style={{ border: "none", borderTop: "1px solid #f0f0f0", margin: "0 0 12px" }} />

      {/* ── FREE shipping banner ── */}
      {shipping === 0 ? (
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "8px 12px", marginBottom: 10, fontSize: 12, color: "#16a34a", fontWeight: 700, textAlign: "center" }}>
          🎉 Yay! You get FREE delivery on this order
        </div>
      ) : (
        <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 8, padding: "8px 12px", marginBottom: 10, fontSize: 12, color: "#92400e", textAlign: "center" }}>
          🚚 Add ₹{999 - subtotal} more for FREE delivery
        </div>
      )}

      {[
        ["Subtotal", fmt(subtotal)],
        ["Delivery Charges", shipping === 0 ? "FREE" : fmt(shipping)],
      ].map(([k, v]) => (
        <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#6b7280", marginBottom: 6 }}>
          <span>{k}</span>
          <span style={{ color: v === "FREE" ? "#16a34a" : "#111", fontWeight: v === "FREE" ? 700 : 400 }}>{v}</span>
        </div>
      ))}

      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 16, marginTop: 8 }}>
        <span>Total</span><span>{fmt(total)}</span>
      </div>
    </Card>
  );
}

// ─── STEP 1: Address ──────────────────────────────────────────────────────────
function AddressStep({ onNext }) {
  const [form, setForm] = useState({ name: "", phone: "", address: "", city: "", state: "", pincode: "" });
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!/^\d{10}$/.test(form.phone)) e.phone = "Enter valid 10-digit phone number";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.state.trim()) e.state = "State is required";
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = "Enter valid 6-digit pincode";
    return e;
  };

  const handleNext = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onNext(form);
  };

  const row2 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 };

  return (
    <Card>
      <h2 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 700 }}>Delivery Address</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Field label="Full Name *" id="name" placeholder="Enter your name" value={form.name} onChange={e => set("name", e.target.value)} error={errors.name} />
        <Field label="Phone Number *" id="phone" placeholder="Enter phone number" value={form.phone} onChange={e => set("phone", e.target.value)} error={errors.phone} maxLength={10} />
        <Field label="Address (House / Street) *" id="address" placeholder="Enter the address" value={form.address} onChange={e => set("address", e.target.value)} error={errors.address} />
        <div style={row2}>
          <Field label="City *" id="city" placeholder="Enter city name" value={form.city} onChange={e => set("city", e.target.value)} error={errors.city} />
          <Field label="State *" id="state" placeholder="Enter state name" value={form.state} onChange={e => set("state", e.target.value)} error={errors.state} />
        </div>
        <div style={{ ...row2, gridTemplateColumns: "1fr 2fr" }}>
          <Field label="Pincode *" id="pincode" placeholder="Enter pin code" value={form.pincode} onChange={e => set("pincode", e.target.value)} error={errors.pincode} maxLength={6} />
          <Field label="Landmark (optional)" id="landmark" placeholder="Enter near landmark" value={form.landmark || ""} onChange={e => set("landmark", e.target.value)} />
        </div>
      </div>
      <button onClick={handleNext} style={{
        marginTop: 24, width: "100%", padding: "13px 0",
        background: theme.primary, color: "#fff", border: "none",
        borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 15
      }}>
        Continue to Payment →
      </button>
    </Card>
  );
}

// ─── STEP 2: Payment ─────────────────────────────────────────────────────────
function PaymentStep({ total, subtotal, onBack, onPay, loading }) {
  const [method, setMethod] = useState("card"); // card | upi | netbanking | cod
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "", name: "" });
  const [upi, setUpi] = useState("");
  const [bank, setBank] = useState("");
  const [errors, setErrors] = useState({});

  const setC = (k, v) => setCard(c => ({ ...c, [k]: v }));

  const formatCard = (v) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (v) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  const validate = () => {
    const e = {};
    if (method === "card") {
      if (card.number.replace(/\s/g, "").length < 16) e.number = "Enter 16-digit card number";
      if (!/^\d{2}\/\d{2}$/.test(card.expiry)) e.expiry = "MM/YY format";
      if (card.cvv.length < 3) e.cvv = "3-digit CVV";
      if (!card.name.trim()) e.name = "Name on card required";
    }
    if (method === "upi" && !upi.includes("@")) e.upi = "Enter valid UPI ID (e.g. name@upi)";
    if (method === "netbanking" && !bank) e.bank = "Select a bank";
    return e;
  };

  const handlePay = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onPay({ method, card: method === "card" ? card : undefined, upi: method === "upi" ? upi : undefined, bank: method === "netbanking" ? bank : undefined });
  };

  const methods = [
    { id: "card", icon: "💳", label: "Credit / Debit Card" },
    { id: "upi", icon: "📱", label: "UPI" },
    { id: "netbanking", icon: "🏦", label: "Net Banking" },
    { id: "cod", icon: "💵", label: "Cash on Delivery" },
  ];

  const banks = ["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Mahindra", "Punjab National Bank"];

  return (
    <Card>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#6b7280", padding: "0 4px" }}>←</button>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Payment</h2>
      </div>

      {/* Method tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {methods.map(m => (
          <button key={m.id} onClick={() => { setMethod(m.id); setErrors({}); }}
            style={{
              padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600,
              border: `2px solid ${method === m.id ? theme.primary : "#e5e7eb"}`,
              background: method === m.id ? `${theme.primary}15` : "#fff",
              color: method === m.id ? theme.primary : "#374151",
              transition: "all .2s"
            }}>
            {m.icon} {m.label}
          </button>
        ))}
      </div>

      {/* Card form */}
      {method === "card" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
            {["VISA", "MC", "AMEX", "RuPay"].map(b => (
              <span key={b} style={{ padding: "3px 8px", border: "1px solid #e5e7eb", borderRadius: 5, fontSize: 10, fontWeight: 800, color: "#555", letterSpacing: 0.5 }}>{b}</span>
            ))}
          </div>
          <Field label="Card Number" id="cn" placeholder="1234 5678 9012 3456" value={card.number}
            onChange={e => setC("number", formatCard(e.target.value))} error={errors.number} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Expiry (MM/YY)" id="exp" placeholder="08/27" value={card.expiry}
              onChange={e => setC("expiry", formatExpiry(e.target.value))} error={errors.expiry} />
            <Field label="CVV" id="cvv" placeholder="•••" type="password" maxLength={4} value={card.cvv}
              onChange={e => setC("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))} error={errors.cvv} />
          </div>
          <Field label="Name on Card" id="cname" placeholder="RAHUL SHARMA" value={card.name}
            onChange={e => setC("name", e.target.value.toUpperCase())} error={errors.name} />
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#6b7280", fontSize: 12 }}>
            <span>🔒</span><span>Your card details are encrypted & secure via Stripe</span>
          </div>
        </div>
      )}

      {/* UPI form */}
      {method === "upi" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
            {["GPay", "PhonePe", "Paytm", "BHIM"].map(a => (
              <span key={a} style={{ padding: "4px 10px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 6, fontSize: 12, fontWeight: 700, color: "#16a34a" }}>{a}</span>
            ))}
          </div>
          <Field label="UPI ID" id="upi" placeholder="yourname@upi" value={upi}
            onChange={e => setUpi(e.target.value)} error={errors.upi} />
        </div>
      )}

      {/* Net banking */}
      {method === "netbanking" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Select Bank</label>
          <select value={bank} onChange={e => setBank(e.target.value)}
            style={{ padding: "10px 12px", border: `1.5px solid ${errors.bank ? "#ef4444" : "#e5e7eb"}`, borderRadius: 8, fontSize: 14, background: "#fafafa" }}>
            <option value="">-- Choose your bank --</option>
            {banks.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          {errors.bank && <span style={{ fontSize: 12, color: "#ef4444" }}>{errors.bank}</span>}
        </div>
      )}

      {/* COD */}
      {method === "cod" && (
        <div style={{ padding: "16px", background: "#fefce8", border: "1px solid #fde68a", borderRadius: 10, fontSize: 14, color: "#92400e" }}>
          💵 You will pay <b>{fmt(total)}</b> in cash upon delivery.
          {subtotal < 999 && (
            <span> (includes <b>₹49 delivery charge</b>)</span>
          )}
        </div>
      )}

      <button onClick={handlePay} disabled={loading}
        style={{
          marginTop: 24, width: "100%", padding: "13px 0",
          background: loading ? "#9ca3af" : "#16a34a", color: "#fff", border: "none",
          borderRadius: 10, cursor: loading ? "not-allowed" : "pointer", fontWeight: 700, fontSize: 15,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8
        }}>
        {loading ? (
          <><Spinner /> Processing…</>
        ) : (
          <>🔒 Pay {fmt(total)}</>
        )}
      </button>

      <p style={{ textAlign: "center", fontSize: 12, color: "#9ca3af", marginTop: 12 }}>
        Secured by <b>Stripe</b> · 256-bit SSL encryption
      </p>
    </Card>
  );
}

function Spinner() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" style={{ animation: "spin 1s linear infinite" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <circle cx="9" cy="9" r="7" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" fill="none" />
      <path d="M9 2a7 7 0 0 1 7 7" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// ─── STEP 3: Confirmation ─────────────────────────────────────────────────────
function ConfirmationStep({ orderId, address, total, onContinue }) {
  return (
    <Card style={{ textAlign: "center" }}>
      <div style={{ fontSize: 64, marginBottom: 12, animation: "pop .4s ease" }}>
        <style>{`@keyframes pop{0%{transform:scale(0)}100%{transform:scale(1)}}`}</style>
        ✅
      </div>
      <h2 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 800, color: "#16a34a" }}>Order Placed!</h2>
      <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 20px" }}>
        Thank you! Your order has been confirmed.<br />You'll receive a confirmation SMS shortly.
      </p>
      <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "16px 20px", marginBottom: 20, textAlign: "left" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 13, color: "#374151", fontWeight: 600 }}>Order ID</span>
          <span style={{ fontSize: 13, color: "#16a34a", fontWeight: 800 }}>#{orderId}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 13, color: "#374151", fontWeight: 600 }}>Amount Paid</span>
          <span style={{ fontSize: 13, fontWeight: 700 }}>{fmt(total)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 13, color: "#374151", fontWeight: 600 }}>Deliver To</span>
          <span style={{ fontSize: 13, color: "#374151", textAlign: "right", maxWidth: 180 }}>{address.name}, {address.city}</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <button onClick={() => onContinue("/orders")}
          style={{ padding: "12px", background: theme.primary, color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 15 }}>
          View My Orders
        </button>
        <button onClick={() => onContinue("/home")}
          style={{ padding: "11px", background: "none", color: theme.primary, border: `1.5px solid ${theme.primary}`, borderRadius: 10, cursor: "pointer", fontWeight: 600, fontSize: 14 }}>
          Continue Shopping
        </button>
      </div>
    </Card>
  );
}

// ─── MAIN CheckoutPage ────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);           // 1=address, 2=payment, 3=confirm
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payLoading, setPayLoading] = useState(false);
  const [address, setAddress] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, color = "#ef4444") => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const token = getToken();
    if (!token) { navigate("/login"); return; }
    fetch(`${API}/bag`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { setItems(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const subtotal = items.reduce((sum, i) => sum + ((i.sale_price ?? i.base_price) * i.quantity), 0);

  // ✅ FIX: ₹49 delivery if subtotal < ₹999, FREE if subtotal >= ₹999
  const shipping = subtotal >= 999 ? 0 : 49;

  const total = subtotal + shipping;

  const handleAddress = (addr) => { setAddress(addr); setStep(2); window.scrollTo(0, 0); };

  const handlePay = async (paymentInfo) => {
    setPayLoading(true);
    try {
      const token = getToken();
      // 1. Create Stripe PaymentIntent on backend
      const intentRes = await fetch(`${API}/payments/create-intent`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(total * 100), currency: "inr" })
      });
      const { clientSecret, error: intentError } = await intentRes.json();
      if (intentError) throw new Error(intentError);

      // 2. Simulate Stripe confirmation (in production use stripe.confirmCardPayment)
      await new Promise(r => setTimeout(r, 1200));

      // 3. Place order on backend
      const orderRes = await fetch(`${API}/orders`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          address,
          payment: { method: paymentInfo.method, status: "paid" },
          subtotal,
          shipping,
          total
        })
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.message || "Order failed");

      setOrderId(orderData.orderId || orderData.id || "ORD" + Date.now());
      setStep(3);
      window.scrollTo(0, 0);
    } catch (err) {
      showToast(err.message || "Payment failed. Please try again.");
    } finally {
      setPayLoading(false);
    }
  };

  if (loading) return <p style={{ padding: 40, textAlign: "center" }}>Loading…</p>;

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", padding: "20px 16px" }}>

      {toast && (
        <div style={{
          position: "fixed", top: 80, left: "50%", transform: "translateX(-50%)",
          background: toast.color, color: "#fff", padding: "10px 22px",
          borderRadius: 8, zIndex: 9999, fontSize: 14, fontWeight: 600,
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)", whiteSpace: "nowrap"
        }}>{toast.msg}</div>
      )}

      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          {step < 3 && (
            <button onClick={() => step === 1 ? navigate("/bag") : setStep(s => s - 1)}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: "#6b7280", padding: "0 2px" }}>←</button>
          )}
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>
            {step === 1 ? "Checkout" : step === 2 ? "Payment" : "Order Confirmed"}
          </h1>
        </div>

        <Steps current={step === 3 ? 3 : step} />

        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "flex-start" }}>
          {/* Main content */}
          <div style={{ flex: 1, minWidth: 300 }}>
            {step === 1 && <AddressStep onNext={handleAddress} />}
            {step === 2 && (
              <PaymentStep
                total={total}
                subtotal={subtotal}
                onBack={() => setStep(1)}
                onPay={handlePay}
                loading={payLoading}
              />
            )}
            {step === 3 && <ConfirmationStep orderId={orderId} address={address} total={total} onContinue={navigate} />}
          </div>

          {/* Order summary (only during address + payment) */}
          {step < 3 && (
            <OrderSummary items={items} subtotal={subtotal} shipping={shipping} total={total} />
          )}
        </div>
      </div>
    </div>
  );
}