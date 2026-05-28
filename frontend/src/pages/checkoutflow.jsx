import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000/api";
const getToken = () => localStorage.getItem("token");

// ── Step indicator ────────────────────────────────────────────────────────────
const steps = ["Cart", "Details", "Payment", "Done"];

function StepBar({ current }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: 36 }}>
      {steps.map((s, i) => (
        <div key={s} style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: i < current ? "#16a34a" : i === current ? "#111" : "#e5e5e5",
              color: i < current ? "#fff" : i === current ? "#fff" : "#999",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700,
              border: i === current ? "2px solid #111" : "none",
              transition: ".3s",
            }}>
              {i < current ? "✓" : i + 1}
            </div>
            <span style={{ fontSize: 11, color: i === current ? "#111" : "#aaa", fontWeight: i === current ? 700 : 400 }}>
              {s}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div style={{ width: 60, height: 2, background: i < current ? "#16a34a" : "#e5e5e5", margin: "0 4px", marginBottom: 18, transition: ".3s" }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Input component ───────────────────────────────────────────────────────────
function Field({ label, value, onChange, placeholder, type = "text", error, required }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#333", marginBottom: 6 }}>
        {label} {required && <span style={{ color: "#e11d48" }}>*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%", padding: "11px 14px",
          border: `1.5px solid ${error ? "#e11d48" : focused ? "#111" : "#ddd"}`,
          borderRadius: 8, fontSize: 14, outline: "none",
          background: focused ? "#fafafa" : "#fff",
          transition: ".2s", boxSizing: "border-box",
          color: "#111",
        }}
      />
      {error && <p style={{ color: "#e11d48", fontSize: 12, marginTop: 4 }}>{error}</p>}
    </div>
  );
}

export default function CheckoutPage() {
  const navigate = useNavigate();

  // ── State ─────────────────────────────────────────────────────────────────
  const [step, setStep]         = useState(1); // 1=details, 2=payment
  const [bagItems, setBagItems] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [placing, setPlacing]   = useState(false);
  const [toast, setToast]       = useState(null);

  // User details
  const [phone, setPhone]           = useState("");
  const [name, setName]             = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity]             = useState("");
  const [state, setState]           = useState("");
  const [pincode, setPincode]       = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  // Errors
  const [errors, setErrors] = useState({});

  // ── Toast ────────────────────────────────────────────────────────────────
  const showToast = (msg, color = "#16a34a") => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Auth guard ───────────────────────────────────────────────────────────
  useEffect(() => {
    const token = getToken();
    // if (!token) { navigate("/login"); return; }
    if (!token) {
      setItems([]);
      setLoading(false);
      return;
    }
    // Pre-fill from stored user data
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.name)  setName(user.name);
    if (user.phone) setPhone(user.phone);

    // Fetch bag
    fetch(`${API}/bag`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        const items = Array.isArray(data) ? data : [];
        if (items.length === 0) { navigate("/bag"); return; }
        setBagItems(items);
        setLoading(false);
      })
      .catch(() => { setLoading(false); navigate("/bag"); });

    // Fetch saved address if exists
    fetch(`${API}/user/address`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.address_line) setAddressLine(data.address_line);
        if (data?.city)         setCity(data.city);
        if (data?.state)        setState(data.state);
        if (data?.pincode)      setPincode(data.pincode);
        if (data?.phone)        setPhone(data.phone);
      })
      .catch(() => {});
  }, [navigate]);

  // ── Price calculations ───────────────────────────────────────────────────
  const subtotal = bagItems.reduce(
    (sum, i) => sum + ((i.sale_price ?? i.base_price) * i.quantity), 0
  );
  const shipping = subtotal > 999 ? 0 : 99;
  const total    = subtotal + shipping;

  // ── Validate Step 1 ──────────────────────────────────────────────────────
  const validateDetails = () => {
    const e = {};
    if (!name.trim())        e.name        = "Name is required";
    if (!phone.trim())       e.phone       = "Phone number is required";
    else if (!/^[6-9]\d{9}$/.test(phone.trim())) e.phone = "Enter valid 10-digit phone number";
    if (!addressLine.trim()) e.addressLine = "Address is required";
    if (!city.trim())        e.city        = "City is required";
    if (!state.trim())       e.state       = "State is required";
    if (!pincode.trim())     e.pincode     = "Pincode is required";
    else if (!/^\d{6}$/.test(pincode.trim())) e.pincode = "Enter valid 6-digit pincode";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleContinue = () => {
    if (validateDetails()) setStep(2);
  };

  // ── Place Order ──────────────────────────────────────────────────────────
  const handlePlaceOrder = async () => {
    const token = getToken();
    if (!token) { navigate("/login"); return; }

    setPlacing(true);
    try {
      const res = await fetch(`${API}/orders`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          address: {
            address_line: addressLine,
            city,
            state,
            pincode,
          },
          payment_method: paymentMethod,
          items: bagItems.map(i => ({
            variant_id: i.variant_id,
            quantity:   i.quantity,
            price:      i.sale_price ?? i.base_price,
          })),
          subtotal,
          shipping,
          total,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        showToast(err.error || "Order failed. Try again.", "#dc2626");
        return;
      }

      const data = await res.json();

      // ── If Razorpay ──────────────────────────────────────────────────────
      if (paymentMethod === "razorpay" && data.razorpay_order_id) {
        const options = {
          key:    data.razorpay_key,
          amount: data.amount,
          currency: "INR",
          name: "TheZuro",
          description: "Order Payment",
          order_id: data.razorpay_order_id,
          handler: async (response) => {
            // Verify payment
            const vRes = await fetch(`${API}/orders/verify-payment`, {
              method: "POST",
              headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
              body: JSON.stringify({ ...response, order_id: data.order_id }),
            });
            if (vRes.ok) {
              navigate("/order-success", { state: { orderId: data.order_id } });
            } else {
              showToast("Payment verification failed", "#dc2626");
            }
          },
          prefill: { name, contact: phone },
          theme:  { color: "#111" },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
        return;
      }

      // ── COD success ───────────────────────────────────────────────────────
      navigate("/order-success", { state: { orderId: data.order_id || data.id } });

    } catch {
      showToast("Something went wrong. Please try again.", "#dc2626");
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#888", fontSize: 16 }}>Loading checkout…</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8f8f8", fontFamily: "Arial, sans-serif" }}>

      {/* TOAST */}
      {toast && (
        <div style={{
          position: "fixed", top: 80, left: "50%", transform: "translateX(-50%)",
          background: toast.color, color: "#fff", padding: "12px 24px",
          borderRadius: 8, zIndex: 9999, fontSize: 14, fontWeight: 600,
          boxShadow: "0 4px 12px rgba(0,0,0,.2)", whiteSpace: "nowrap",
        }}>
          {toast.msg}
        </div>
      )}

      {/* HEADER */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #eee",
        padding: "16px 40px", display: "flex", alignItems: "center",
        justifyContent: "space-between",
      }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#111" }}>
          🛒 Checkout
        </h1>
        <span
          onClick={() => navigate("/bag")}
          style={{ fontSize: 13, color: "#666", cursor: "pointer", textDecoration: "underline" }}
        >
          ← Back to Bag
        </span>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px" }}>

        {/* STEP BAR */}
        <StepBar current={step} />

        <div style={{ display: "flex", gap: 28, flexWrap: "wrap", alignItems: "flex-start" }}>

          {/* ── LEFT: FORM ── */}
          <div style={{ flex: 1, minWidth: 300 }}>

            {/* ── STEP 1: Details ── */}
            {step === 1 && (
              <div style={{ background: "#fff", borderRadius: 14, padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,.07)" }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111", marginBottom: 24 }}>
                  📋 Delivery Details
                </h2>

                <Field label="Full Name"     value={name}        onChange={setName}        placeholder="e.g. Rahul Sharma"      error={errors.name}        required />
                <Field label="Phone Number"  value={phone}       onChange={setPhone}       placeholder="10-digit mobile number" error={errors.phone}       required type="tel" />
                <Field label="Address Line"  value={addressLine} onChange={setAddressLine} placeholder="House no., Street, Area" error={errors.addressLine} required />

                <div style={{ display: "flex", gap: 14 }}>
                  <div style={{ flex: 1 }}>
                    <Field label="City"    value={city}    onChange={setCity}    placeholder="e.g. Mumbai"   error={errors.city}    required />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Field label="State"   value={state}   onChange={setState}   placeholder="e.g. Maharashtra" error={errors.state}  required />
                  </div>
                </div>

                <Field label="Pincode" value={pincode} onChange={setPincode} placeholder="6-digit pincode" error={errors.pincode} required type="tel" />

                <button
                  onClick={handleContinue}
                  style={{
                    width: "100%", padding: "14px 0",
                    background: "#111", color: "#fff",
                    border: "none", borderRadius: 10,
                    fontSize: 15, fontWeight: 700, cursor: "pointer",
                    marginTop: 8, transition: ".2s",
                  }}
                  onMouseEnter={e => e.target.style.background = "#333"}
                  onMouseLeave={e => e.target.style.background = "#111"}
                >
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* ── STEP 2: Payment ── */}
            {step === 2 && (
              <div style={{ background: "#fff", borderRadius: 14, padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,.07)" }}>

                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                  <span
                    onClick={() => setStep(1)}
                    style={{ fontSize: 13, color: "#666", cursor: "pointer", textDecoration: "underline" }}
                  >
                    ← Edit Details
                  </span>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111" }}>
                    💳 Payment Method
                  </h2>
                </div>

                {/* Delivery address recap */}
                <div style={{
                  background: "#f8f8f8", borderRadius: 10,
                  padding: "14px 16px", marginBottom: 24,
                  border: "1px solid #eee",
                }}>
                  <p style={{ fontSize: 13, color: "#555", margin: 0, lineHeight: 1.7 }}>
                    <b style={{ color: "#111" }}>📍 Delivering to:</b><br />
                    {name} | {phone}<br />
                    {addressLine}, {city}, {state} – {pincode}
                  </p>
                </div>

                {/* Payment options */}
                {[
                  { id: "cod",      label: "💵 Cash on Delivery",   sub: "Pay when your order arrives" },
                  { id: "razorpay", label: "💳 Pay Online (Razorpay)", sub: "UPI, Card, Net Banking" },
                ].map(opt => (
                  <div
                    key={opt.id}
                    onClick={() => setPaymentMethod(opt.id)}
                    style={{
                      border: `2px solid ${paymentMethod === opt.id ? "#111" : "#e5e5e5"}`,
                      borderRadius: 10, padding: "14px 16px",
                      marginBottom: 12, cursor: "pointer",
                      background: paymentMethod === opt.id ? "#f5f5f5" : "#fff",
                      transition: ".2s",
                      display: "flex", alignItems: "center", gap: 14,
                    }}
                  >
                    <div style={{
                      width: 20, height: 20, borderRadius: "50%",
                      border: `2px solid ${paymentMethod === opt.id ? "#111" : "#ccc"}`,
                      background: paymentMethod === opt.id ? "#111" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      {paymentMethod === opt.id && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#111" }}>{opt.label}</p>
                      <p style={{ margin: 0, fontSize: 12, color: "#888" }}>{opt.sub}</p>
                    </div>
                  </div>
                ))}

                <button
                  onClick={handlePlaceOrder}
                  disabled={placing}
                  style={{
                    width: "100%", padding: "15px 0",
                    background: placing ? "#999" : "#111",
                    color: "#fff", border: "none", borderRadius: 10,
                    fontSize: 16, fontWeight: 700,
                    cursor: placing ? "not-allowed" : "pointer",
                    marginTop: 16, transition: ".2s",
                  }}
                  onMouseEnter={e => { if (!placing) e.target.style.background = "#333"; }}
                  onMouseLeave={e => { if (!placing) e.target.style.background = "#111"; }}
                >
                  {placing
                    ? "Placing Order..."
                    : paymentMethod === "cod"
                    ? "✅ Place Order (COD)"
                    : "🔒 Pay ₹" + total.toFixed(0) + " Securely"}
                </button>

                <p style={{ textAlign: "center", fontSize: 12, color: "#aaa", marginTop: 14 }}>
                  🔒 100% Secure Checkout
                </p>
              </div>
            )}
          </div>

          {/* ── RIGHT: Order Summary ── */}
          <div style={{
            width: 300, background: "#fff", borderRadius: 14,
            padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,.07)",
            position: "sticky", top: 90,
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 18, color: "#111" }}>
              Order Summary
            </h3>

            {/* Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 18 }}>
              {bagItems.map(item => (
                <div key={item.id} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{
                    width: 52, height: 58, borderRadius: 8,
                    background: "#f5f5f5", overflow: "hidden", flexShrink: 0,
                  }}>
                    {item.image_url
                      ? <img src={item.image_url} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🛍️</div>
                    }
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#111", lineHeight: 1.3 }}>
                      {item.title}
                    </p>
                    <p style={{ margin: "2px 0 0", fontSize: 12, color: "#888" }}>
                      Qty: {item.quantity} × ₹{item.sale_price ?? item.base_price}
                    </p>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>
                    ₹{((item.sale_price ?? item.base_price) * item.quantity).toFixed(0)}
                  </span>
                </div>
              ))}
            </div>

            <hr style={{ border: "none", borderTop: "1px solid #f0f0f0", margin: "14px 0" }} />

            {/* Price breakdown */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#666" }}>Subtotal ({bagItems.length} items)</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#666" }}>Shipping</span>
                <span style={{ color: shipping === 0 ? "#16a34a" : "#111" }}>
                  {shipping === 0 ? "FREE 🎉" : `₹${shipping}`}
                </span>
              </div>
              {shipping > 0 && (
                <p style={{ margin: 0, fontSize: 12, color: "#16a34a" }}>
                  Add ₹{(999 - subtotal).toFixed(0)} more for free shipping!
                </p>
              )}
            </div>

            <hr style={{ border: "none", borderTop: "1px solid #f0f0f0", margin: "14px 0" }} />

            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 17 }}>
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            {shipping === 0 && (
              <div style={{
                marginTop: 14, background: "#f0fdf4", borderRadius: 8,
                padding: "10px 14px", border: "1px solid #bbf7d0",
              }}>
                <p style={{ margin: 0, fontSize: 12, color: "#16a34a", fontWeight: 600 }}>
                  ✅ You saved ₹99 on shipping!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile responsive */}
      <style>{`
        @media (max-width: 768px) {
          .checkout-layout { flex-direction: column !important; }
        }
      `}</style>
    </div>
  );
}