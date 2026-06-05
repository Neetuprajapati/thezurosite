import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import theme from "./theme";

const QUICK_PROMPTS = [
  "Track my order",
  "Payment issue",
  "Return policy",
  "Contact support",
];

function buildReply(text) {
  const q = text.toLowerCase();

  if (q.includes("track") || q.includes("order") || q.includes("delivery")) {
    return {
      text: "You can track your order from the Track Orders page. Open it from Alerts tab or click below.",
      cta: { label: "Go To Track Orders", path: "/track-orders" },
    };
  }

  if (q.includes("payment") || q.includes("upi") || q.includes("card") || q.includes("gpay") || q.includes("qr")) {
    return {
      text: "For payment help: 1) Retry from checkout payment step 2) For QR payment, share your UTR 3) For card/GPay failures, try again after 2 minutes.",
      cta: { label: "Open Checkout", path: "/checkout" },
    };
  }

  if (q.includes("return") || q.includes("refund") || q.includes("cancel")) {
    return {
      text: "You can review cancellation and return rules in our policy pages.",
      cta: { label: "Open Cancellation Policy", path: "/cancellation" },
    };
  }

  if (q.includes("contact") || q.includes("help") || q.includes("support") || q.includes("agent")) {
    return {
      text: "You can connect with support from Contact Us page. Share your order id and issue for faster help.",
      cta: { label: "Contact Support", path: "/contact" },
    };
  }

  if (q.includes("bag") || q.includes("cart")) {
    return {
      text: "For bag/cart issues, please open your bag and verify quantity, variant, and login session.",
      cta: { label: "Open Bag", path: "/bag" },
    };
  }

  return {
    text: "I can help with order tracking, payment, returns, and support. Please type your query in short.",
  };
}

export default function ChatbotWidget() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hi, welcome to TheZuro support. Ask me anything about order, payment, returns, or delivery.",
    },
  ]);

  const hasMessages = useMemo(() => messages.length > 0, [messages.length]);

  const pushUserMessage = (text) => {
    const clean = text.trim();
    if (!clean) return;

    const reply = buildReply(clean);
    setMessages((prev) => [
      ...prev,
      { from: "user", text: clean },
      { from: "bot", text: reply.text, cta: reply.cta || null },
    ]);
    setInput("");
  };

  const ChatbotIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
      <circle cx="9" cy="11" r="1" fill="currentColor" />
      <circle cx="13" cy="11" r="1" fill="currentColor" />
      <circle cx="17" cy="11" r="1" fill="currentColor" />
    </svg>
  );

  const cardBg = theme.white || "#fff";
  const softBg = "#faf8f2";
  const borderColor = theme.lightPurple || "rgba(201,168,76,.25)";
  const darkText = theme.dark || "#111";
  const softText = "#6b6b6b";

  return (
    <>
      {open && (
        <div
          style={{
            position: "fixed",
            right: 16,
            bottom: "calc(84px + env(safe-area-inset-bottom, 0px))",
            width: 330,
            maxWidth: "calc(100vw - 24px)",
            background: cardBg,
            border: `1px solid ${borderColor}`,
            borderRadius: 14,
            boxShadow: "0 14px 40px rgba(0,0,0,.16)",
            zIndex: 10001,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: `linear-gradient(135deg, ${theme.secondary} 0%, ${theme.primary} 100%)`,
              color: "#fff",
              padding: "12px 14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>TheZuro Assistant</div>
              <div style={{ fontSize: 11, opacity: 0.8 }}>Typically replies instantly</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ border: "none", background: "rgba(255,255,255,.2)", color: "#fff", fontSize: 15, fontWeight: 700, borderRadius: 8, width: 28, height: 28, cursor: "pointer" }}
            >
              X
            </button>
          </div>

          <div style={{ maxHeight: 320, overflowY: "auto", padding: 12, background: softBg }}>
            {messages.map((m, idx) => (
              <div
                key={`${m.from}-${idx}`}
                style={{
                  display: "flex",
                  justifyContent: m.from === "user" ? "flex-end" : "flex-start",
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    maxWidth: "85%",
                    padding: "9px 11px",
                    borderRadius: 10,
                    fontSize: 13,
                    lineHeight: 1.4,
                    background: m.from === "user" ? theme.secondary : cardBg,
                    color: m.from === "user" ? "#fff" : darkText,
                    border: m.from === "user" ? "none" : `1px solid ${borderColor}`,
                  }}
                >
                  <div>{m.text}</div>
                  {m.cta && (
                    <button
                      onClick={() => {
                        navigate(m.cta.path);
                        setOpen(false);
                      }}
                      style={{
                        marginTop: 8,
                        border: "none",
                        background: theme.primary,
                        color: theme.buttonText || "#111",
                        padding: "6px 10px",
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {m.cta.label}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {hasMessages && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                {QUICK_PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => pushUserMessage(p)}
                    style={{
                      border: `1px solid ${borderColor}`,
                      background: cardBg,
                      color: darkText,
                      borderRadius: 999,
                      padding: "5px 10px",
                      fontSize: 11,
                      cursor: "pointer",
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: 8, padding: 10, borderTop: `1px solid ${borderColor}`, background: cardBg }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && pushUserMessage(input)}
              placeholder="Type your doubt..."
              style={{ flex: 1, border: `1px solid ${borderColor}`, borderRadius: 9, padding: "9px 10px", fontSize: 13, outline: "none", color: darkText }}
            />
            <button
              onClick={() => pushUserMessage(input)}
              style={{ border: "none", background: theme.secondary, color: "#fff", borderRadius: 9, padding: "0 14px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
            >
              Send
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((s) => !s)}
        style={{
          position: "fixed",
          right: 16,
          bottom: "calc(18px + env(safe-area-inset-bottom, 0px))",
          width: 56,
          height: 56,
          borderRadius: "50%",
          border: "none",
          background: `linear-gradient(135deg, ${theme.secondary} 0%, ${theme.primary} 100%)`,
          color: theme.white || "#fff",
          boxShadow: "0 10px 26px rgba(0,0,0,.22)",
          cursor: "pointer",
          zIndex: 10002,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-label="Open Support Chat"
      >
        <ChatbotIcon />
      </button>
    </>
  );
}
