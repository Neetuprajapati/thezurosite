const express = require("express");
const router = express.Router();
const db = require("../db");
const verifyToken = require("../middleware/auth");

function toTrackingSteps(item, order) {
  const normalized = (item.status || order.status || "placed").toLowerCase();
  const done = new Set();

  if (["placed", "confirmed", "processing", "shipped", "out_for_delivery", "delivered"].includes(normalized)) {
    done.add("placed");
  }
  if (["confirmed", "processing", "shipped", "out_for_delivery", "delivered"].includes(normalized)) {
    done.add("confirmed");
  }
  if (["shipped", "out_for_delivery", "delivered"].includes(normalized)) {
    done.add("shipped");
  }
  if (["out_for_delivery", "delivered"].includes(normalized)) {
    done.add("out_for_delivery");
  }
  if (["delivered"].includes(normalized)) {
    done.add("delivered");
  }

  if (["cancelled", "canceled", "returned", "failed"].includes(normalized)) {
    return [
      { key: "placed", label: "Order Placed", done: true },
      { key: "cancelled", label: "Order Cancelled", done: true },
    ];
  }

  return [
    { key: "placed", label: "Order Placed", done: done.has("placed") },
    { key: "confirmed", label: "Order Confirmed", done: done.has("confirmed") },
    { key: "shipped", label: "Shipped", done: done.has("shipped") },
    { key: "out_for_delivery", label: "Out for Delivery", done: done.has("out_for_delivery") },
    { key: "delivered", label: "Delivered", done: done.has("delivered") },
  ];
}


// ✅ GET PROFILE  (🔥 THIS WAS MISSING)
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT 
        id, 
        full_name AS name, 
        email, 
        phone, 
        gender, 
        date_of_birth AS dob
       FROM users 
       WHERE id = $1`,
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(rows[0]);

  } catch (err) {
    console.error("PROFILE ERROR 👉", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ GET USER STATS
router.get("/stats", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const ordersResult = await db.query(
      `SELECT COUNT(*) FROM orders WHERE user_id = $1`,
      [userId]
    );

    const wishlistResult = await db.query(
      `SELECT COUNT(*) FROM wishlists WHERE user_id = $1`,
      [userId]
    );

    res.json({
      totalOrders: parseInt(ordersResult.rows[0].count),
      wishlistItems: parseInt(wishlistResult.rows[0].count),
      rewardPoints: 0
    });

  } catch (err) {
    console.error("STATS ERROR 👉", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ UPDATE PROFILE
router.put("/update", verifyToken, async (req, res) => {
  try {
    const { name, email, phone, gender, dob } = req.body;

    await db.query(
      `UPDATE users 
       SET full_name=$1, email=$2, phone=$3, gender=$4, date_of_birth=$5 
       WHERE id=$6`,
      [name, email, phone, gender, dob, req.user.id]
    );

    const { rows } = await db.query(
      `SELECT 
        id, 
        full_name AS name, 
        email, 
        phone, 
        gender, 
        date_of_birth AS dob
       FROM users 
       WHERE id = $1`,
      [req.user.id]
    );

    res.json(rows[0]);

  } catch (err) {
    console.error("UPDATE ERROR 👉", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET DEFAULT ADDRESS (for checkout prefill)
router.get("/address", verifyToken, async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT
         id,
         full_name,
         phone,
         line1,
         city,
         state,
         pincode,
         is_default,
         updated_at
       FROM addresses
       WHERE user_id = $1
       ORDER BY is_default DESC, updated_at DESC
       LIMIT 1`,
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Address not found" });
    }

    const a = rows[0];
    return res.json({
      id: a.id,
      full_name: a.full_name,
      phone: a.phone,
      address_line: a.line1,
      city: a.city,
      state: a.state,
      pincode: a.pincode,
      is_default: a.is_default,
    });
  } catch (err) {
    console.error("GET ADDRESS ERROR 👉", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ✅ UPSERT DEFAULT ADDRESS (save once, reuse in checkout)
router.put("/address", verifyToken, async (req, res) => {
  try {
    const {
      full_name,
      phone,
      address_line,
      city,
      state,
      pincode,
      label = "Home",
    } = req.body || {};

    if (!full_name || !phone || !address_line || !city || !state || !pincode) {
      return res.status(400).json({ message: "All address fields are required" });
    }

    // keep profile basics in sync
    await db.query(
      `UPDATE users
       SET full_name = COALESCE($1, full_name),
           phone = COALESCE($2, phone)
       WHERE id = $3`,
      [full_name, phone, req.user.id]
    );

    const existing = await db.query(
      `SELECT id FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, updated_at DESC LIMIT 1`,
      [req.user.id]
    );

    let saved;
    if (existing.rows.length > 0) {
      const updated = await db.query(
        `UPDATE addresses
         SET label = $1,
             full_name = $2,
             phone = $3,
             line1 = $4,
             city = $5,
             state = $6,
             pincode = $7,
             is_default = TRUE,
             updated_at = NOW()
         WHERE id = $8
         RETURNING id, full_name, phone, line1, city, state, pincode, is_default`,
        [label, full_name, phone, address_line, city, state, pincode, existing.rows[0].id]
      );
      saved = updated.rows[0];
    } else {
      const inserted = await db.query(
        `INSERT INTO addresses (
           user_id, label, full_name, phone, line1, city, state, pincode, is_default
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, TRUE)
         RETURNING id, full_name, phone, line1, city, state, pincode, is_default`,
        [req.user.id, label, full_name, phone, address_line, city, state, pincode]
      );
      saved = inserted.rows[0];
    }

    return res.json({
      id: saved.id,
      full_name: saved.full_name,
      phone: saved.phone,
      address_line: saved.line1,
      city: saved.city,
      state: saved.state,
      pincode: saved.pincode,
      is_default: saved.is_default,
    });
  } catch (err) {
    console.error("SAVE ADDRESS ERROR 👉", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ✅ TRACK ORDER (by tracking number, order number/id, variant id, or product title)
router.get("/track", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const rawQuery = String(req.query.q || "").trim();

    if (!rawQuery) {
      return res.status(400).json({ message: "Tracking ID / Order ID is required" });
    }

    const numericQuery = Number(rawQuery);
    const isNumeric = Number.isFinite(numericQuery);

    const { rows } = await db.query(
      `SELECT
         o.id AS order_id,
         o.order_number,
         o.status AS order_status,
         o.placed_at,
         o.expected_delivery,
         o.delivered_at AS order_delivered_at,
         oi.id AS order_item_id,
         oi.variant_id,
         oi.product_title,
         oi.quantity,
         oi.unit_price,
         oi.total_price,
         oi.status AS item_status,
         oi.tracking_number,
         oi.tracking_url,
         oi.shipped_at,
         oi.delivered_at AS item_delivered_at,
         oi.created_at AS item_created_at
       FROM orders o
       JOIN order_items oi ON oi.order_id = o.id
       WHERE o.user_id = $1
         AND (
           oi.tracking_number ILIKE $2
           OR o.order_number ILIKE $2
           OR o.id::text = $3
           OR ($4::boolean AND oi.variant_id = $5)
           OR oi.product_title ILIKE $2
         )
       ORDER BY COALESCE(oi.shipped_at, oi.created_at) DESC
       LIMIT 25`,
      [userId, `%${rawQuery}%`, rawQuery, isNumeric, isNumeric ? numericQuery : null]
    );

    const items = rows.map((r) => ({
      orderId: r.order_id,
      orderNumber: r.order_number,
      orderStatus: r.order_status,
      placedAt: r.placed_at,
      expectedDelivery: r.expected_delivery,
      deliveredAt: r.item_delivered_at || r.order_delivered_at,
      orderItemId: r.order_item_id,
      variantId: r.variant_id,
      productTitle: r.product_title,
      quantity: r.quantity,
      unitPrice: Number(r.unit_price || 0),
      totalPrice: Number(r.total_price || 0),
      status: r.item_status || r.order_status,
      trackingNumber: r.tracking_number,
      trackingUrl: r.tracking_url,
      shippedAt: r.shipped_at,
      steps: toTrackingSteps(
        { status: r.item_status },
        { status: r.order_status }
      ),
    }));

    res.json({
      query: rawQuery,
      count: items.length,
      items,
    });
  } catch (err) {
    console.error("TRACK ERROR 👉", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;