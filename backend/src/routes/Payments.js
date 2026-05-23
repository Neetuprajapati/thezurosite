// routes/payments.js  — Express backend for Stripe PaymentIntent
// npm install stripe

const express = require("express");
const router  = express.Router();
const Stripe  = require("stripe");
const auth    = require("../middleware/auth"); // your existing JWT middleware

const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // set in .env

// POST /api/payments/create-intent
router.post("/create-intent", auth, async (req, res) => {
  try {
    const { amount, currency = "inr" } = req.body;

    if (!amount || amount < 100) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,           // in paise (e.g. ₹99 = 9900)
      currency,
      automatic_payment_methods: { enabled: true },
      metadata: { userId: req.user.id }
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Stripe error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/payments/webhook  — Stripe webhook (confirm payment server-side)
router.post("/webhook", express.raw({ type: "application/json" }), (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object;
    console.log("Payment succeeded:", pi.id, "amount:", pi.amount / 100);
    // TODO: update your DB order status to 'paid'
  }

  res.json({ received: true });
});

module.exports = router;

// ─── Register in app.js ──────────────────────────────────────────────────────
// const paymentRoutes = require("./routes/payments");
// app.use("/api/payments", paymentRoutes);