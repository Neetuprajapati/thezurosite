import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";

const API = API_URL;
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
  const location = useLocation();

  // ── State ─────────────────────────────────────────────────────────────────
  const initialStep = location.state?.startStep === 2 ? 2 : 1;
  const [step, setStep]         = useState(initialStep); // 1=details, 2=payment
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
  const [upiRef, setUpiRef] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [qrSecondsLeft, setQrSecondsLeft] = useState(120);
  const [qrSeed, setQrSeed] = useState(Date.now());
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

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
      setBagItems([]);
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
        if (data?.full_name)    setName(data.full_name);
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
  const upiParams = `pa=merchant@upi&pn=TheZuro&am=${Math.max(total, 1).toFixed(2)}&cu=INR&tn=TheZuro%20Order&tr=TZ${qrSeed}`;
  const upiLink = `upi://pay?${upiParams}`;
  const gpayLink = `tez://upi/pay?${upiParams}`;
  const phonePeLink = `phonepe://pay?${upiParams}`;
  const paytmLink = `paytmmp://pay?${upiParams}`;
  const qrImage = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upiLink)}`;

  useEffect(() => {
    if (paymentMethod !== "qr") return;
    setQrSecondsLeft(120);
    setUpiRef("");

    const timer = setInterval(() => {
      setQrSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [paymentMethod, qrSeed]);

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

  const handleContinue = async () => {
    if (!validateDetails()) return;

    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const saveRes = await fetch(`${API}/user/address`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: name,
          phone,
          address_line: addressLine,
          city,
          state,
          pincode,
          label: "Home",
        }),
      });

      if (!saveRes.ok) {
        const err = await saveRes.json().catch(() => ({}));
        setPaymentError(err.message || "Address save failed. Please try again.");
        return;
      }

      setPaymentError("");
      setStep(2);
    } catch {
      setPaymentError("Address save failed. Please check your network.");
    }
  };

  // ── Place Order ──────────────────────────────────────────────────────────
  const handlePlaceOrder = async () => {
    const token = getToken();
    if (!token) { navigate("/login"); return; }

    setPaymentError("");

    if (paymentMethod === "qr" && upiRef.trim().length < 8) {
      setPaymentError("Please enter valid UTR / transaction reference (min 8 chars) after QR payment.");
      return;
    }

    if (paymentMethod === "qr" && qrSecondsLeft <= 0) {
      setPaymentError("QR expired. Please generate a new QR and complete payment within 2 minutes.");
      return;
    }

    if (paymentMethod === "card") {
      const digits = cardNumber.replace(/\s/g, "");
      const cardValid = /^\d{16}$/.test(digits);
      const expiryValid = /^(0[1-9]|1[0-2])\/(\d{2})$/.test(cardExpiry.trim());
      const cvvValid = /^\d{3}$/.test(cardCvv.trim());
      if (!cardValid || !expiryValid || !cvvValid) {
        setPaymentError("Enter valid card number (16 digits), expiry (MM/YY), and CVV (3 digits).");
        return;
      }
    }

    const backendPaymentMethod =
      paymentMethod === "cod"
        ? "cod"
        : paymentMethod === "qr"
        ? "upi_qr"
        : "razorpay";

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
          payment_method: backendPaymentMethod,
          payment_reference: paymentMethod === "qr" ? upiRef.trim() : null,
          payment_meta: paymentMethod === "card" ? { last4: cardNumber.replace(/\s/g, "").slice(-4), type: "card" } : null,
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
      if (["gpay", "card"].includes(paymentMethod) && data.razorpay_order_id) {
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
              navigate("/order-success", { state: { orderId: data.order_id, status: "success", method: paymentMethod } });
            } else {
              navigate("/order-success", { state: { orderId: data.order_id, status: "failed", method: paymentMethod } });
            }
          },
          modal: {
            ondismiss: () => navigate("/order-success", { state: { orderId: data.order_id, status: "failed", method: paymentMethod } }),
          },
          prefill: { name, contact: phone },
          theme:  { color: "#111" },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
        return;
      }

      // ── COD / QR success ───────────────────────────────────────────────────
      navigate("/order-success", {
        state: {
          orderId: data.order_id || data.id,
          status: "success",
          method: paymentMethod,
        },
      });

    } catch {
      setPaymentError("Payment failed. Please try again.");
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

                <Field label="Full Name"     value={name}        onChange={setName}        placeholder="Enter your name"      error={errors.name}        required />
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
                {paymentError && (
                  <p style={{ color: "#dc2626", fontSize: 12, marginTop: 10 }}>
                    {paymentError}
                  </p>
                )}
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
                  { id: "qr",    label: "📱 UPI QR Code",      sub: "Scan QR with any UPI app" },
                  { id: "cod",   label: "💵 Cash on Delivery", sub: "Pay when your order arrives" },
                  { id: "gpay",  label: "🟢 UPI Apps",        sub: "Google Pay, PhonePe, Paytm" },
                  { id: "card",  label: "💳 Debit/Credit Card", sub: "Visa, Mastercard, RuPay" },
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

                {paymentMethod === "qr" && (
                  <div style={{
                    border: "1px solid #e5e5e5",
                    borderRadius: 12,
                    padding: 14,
                    marginTop: 6,
                    background: "#fafafa",
                    textAlign: "center",
                  }}>
                    <p style={{ margin: "0 0 10px", fontSize: 13, color: "#555" }}>
                      Scan this QR to pay {`₹${total.toFixed(2)}`} via any UPI app.
                    </p>
                    <p style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 700, color: qrSecondsLeft <= 20 ? "#dc2626" : "#1f8f3a" }}>
                      QR valid for: {String(Math.floor(qrSecondsLeft / 60)).padStart(2, "0")}:{String(qrSecondsLeft % 60).padStart(2, "0")}
                    </p>
                    <img src={qrImage} alt="UPI QR Code" style={{ width: 180, height: 180, borderRadius: 10, border: "1px solid #eee" }} />
                    <input
                      value={upiRef}
                      onChange={(e) => setUpiRef(e.target.value.toUpperCase())}
                      placeholder="Enter UTR / Txn Ref"
                      style={{
                        marginTop: 10,
                        width: "100%",
                        border: "1px solid #ddd",
                        borderRadius: 8,
                        padding: "10px 12px",
                        fontSize: 13,
                        boxSizing: "border-box",
                      }}
                    />
                    <p style={{ margin: "8px 0 0", fontSize: 12, color: "#888" }}>
                      Scan, pay, then enter UTR and place order within 2 minutes.
                    </p>
                    <button
                      onClick={() => setQrSeed(Date.now())}
                      style={{
                        marginTop: 10,
                        border: "1px solid #111",
                        background: "#fff",
                        color: "#111",
                        borderRadius: 8,
                        padding: "8px 12px",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Generate New QR (2 min)
                    </button>
                  </div>
                )}

                {paymentMethod === "gpay" && (
                  <div style={{
                    border: "1px solid #e5e5e5",
                    borderRadius: 12,
                    padding: 14,
                    marginTop: 6,
                    background: "#fafafa",
                  }}>
                    <p style={{ margin: "0 0 10px", fontSize: 13, color: "#555" }}>
                      Choose any UPI app for payment.
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      <a href={gpayLink} style={{ display: "inline-block", textDecoration: "none", padding: "10px 12px", background: "#1f8f3a", color: "#fff", borderRadius: 8, fontWeight: 700, fontSize: 13 }}>
                        Google Pay
                      </a>
                      <a href={phonePeLink} style={{ display: "inline-block", textDecoration: "none", padding: "10px 12px", background: "#5f259f", color: "#fff", borderRadius: 8, fontWeight: 700, fontSize: 13 }}>
                        PhonePe
                      </a>
                      <a href={paytmLink} style={{ display: "inline-block", textDecoration: "none", padding: "10px 12px", background: "#00baf2", color: "#002970", borderRadius: 8, fontWeight: 700, fontSize: 13 }}>
                        Paytm
                      </a>
                      <a href={upiLink} style={{ display: "inline-block", textDecoration: "none", padding: "10px 12px", background: "#111", color: "#fff", borderRadius: 8, fontWeight: 700, fontSize: 13 }}>
                        Any UPI App
                      </a>
                    </div>
                  </div>
                )}

                {paymentMethod === "card" && (
                  <div style={{
                    border: "1px solid #e5e5e5",
                    borderRadius: 12,
                    padding: 14,
                    marginTop: 6,
                    background: "#fafafa",
                  }}>
                    <input
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/[^\d\s]/g, "").slice(0, 19))}
                      placeholder="Card Number"
                      style={{ width: "100%", border: "1px solid #ddd", borderRadius: 8, padding: "10px 12px", fontSize: 13, boxSizing: "border-box", marginBottom: 8 }}
                    />
                    <div style={{ display: "flex", gap: 8 }}>
                      <input
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value.replace(/[^\d/]/g, "").slice(0, 5))}
                        placeholder="MM/YY"
                        style={{ flex: 1, border: "1px solid #ddd", borderRadius: 8, padding: "10px 12px", fontSize: 13, boxSizing: "border-box" }}
                      />
                      <input
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                        placeholder="CVV"
                        style={{ flex: 1, border: "1px solid #ddd", borderRadius: 8, padding: "10px 12px", fontSize: 13, boxSizing: "border-box" }}
                      />
                    </div>
                  </div>
                )}

                {paymentError && (
                  <p style={{ color: "#dc2626", fontSize: 12, marginTop: 10 }}>
                    {paymentError}
                  </p>
                )}

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
                    : paymentMethod === "qr"
                    ? qrSecondsLeft <= 0
                      ? "⏱ QR Expired - Regenerate QR"
                      : "✅ Place Order (QR Paid)"
                    : paymentMethod === "gpay"
                    ? "🟢 Pay via UPI App"
                    : "💳 Pay ₹" + total.toFixed(0) + " by Card"}
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