const express = require("express");
const router = express.Router();
const pool = require("../db");
const auth = require("../middleware/auth");

const getOrCreateCart = async (userId, client = pool) => {
  let result = await client.query("SELECT id FROM carts WHERE user_id = $1", [userId]);
  if (result.rows.length > 0) return result.rows[0].id;

  result = await client.query("INSERT INTO carts (user_id) VALUES ($1) RETURNING id", [userId]);
  return result.rows[0].id;
};

const makeOrderNumber = () => `TZ-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`;
const makeTrackingNumber = () => `TRK-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`;

router.post("/", auth, async (req, res) => {
  const userId = req.user.id;
  const {
    name,
    phone,
    address,
    payment_method = "cod",
    shipping = 0,
    total,
    payment_reference = null,
  } = req.body || {};

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const cartId = await getOrCreateCart(userId, client);

    const cartItems = await client.query(
      `SELECT
         ci.variant_id,
         ci.quantity,
         ci.unit_price::float,
         pv.attributes,
         p.id AS product_id,
         p.title,
         p.seller_id,
         p.tax_percent
       FROM cart_items ci
       JOIN product_variants pv ON pv.id = ci.variant_id
       JOIN products p ON p.id = pv.product_id
       WHERE ci.cart_id = $1`,
      [cartId]
    );

    if (cartItems.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Bag is empty" });
    }

    const subtotal = cartItems.rows.reduce(
      (sum, item) => sum + Number(item.unit_price || 0) * Number(item.quantity || 0),
      0
    );
    const shippingFee = Number(shipping || 0);
    const totalAmount = Number(total || subtotal + shippingFee);

    const orderStatus = payment_method === "cod" ? "confirmed" : "pending";
    const orderNumber = makeOrderNumber();

    const addressLine = address?.address_line || address?.line1 || null;
    const city = address?.city || null;
    const state = address?.state || null;
    const pincode = address?.pincode || null;
    const hasCompleteAddressPayload = Boolean(name && phone && addressLine && city && state && pincode);

    // Reuse last default address if available.
    const addressResult = await client.query(
      `SELECT id
       FROM addresses
       WHERE user_id = $1
       ORDER BY is_default DESC, updated_at DESC
       LIMIT 1`,
      [userId]
    );

    let shippingAddressId = null;
    if (hasCompleteAddressPayload && addressResult.rows.length > 0) {
      const updatedAddress = await client.query(
        `UPDATE addresses
         SET full_name = $1,
             phone = $2,
             line1 = $3,
             city = $4,
             state = $5,
             pincode = $6,
             is_default = TRUE,
             updated_at = NOW()
         WHERE id = $7
         RETURNING id`,
        [name, phone, addressLine, city, state, pincode, addressResult.rows[0].id]
      );
      shippingAddressId = updatedAddress.rows[0]?.id || null;
    } else if (hasCompleteAddressPayload) {
      const insertedAddress = await client.query(
        `INSERT INTO addresses (
           user_id, label, full_name, phone, line1, city, state, pincode, is_default
         ) VALUES ($1, 'Home', $2, $3, $4, $5, $6, $7, TRUE)
         RETURNING id`,
        [userId, name, phone, addressLine, city, state, pincode]
      );
      shippingAddressId = insertedAddress.rows[0]?.id || null;
    } else if (addressResult.rows.length > 0) {
      shippingAddressId = addressResult.rows[0].id;
    }

    if (!shippingAddressId) {
      const fallbackAddress = await client.query(
        `SELECT id
         FROM addresses
         WHERE user_id = $1
         ORDER BY is_default DESC, updated_at DESC, created_at DESC
         LIMIT 1`,
        [userId]
      );
      shippingAddressId = fallbackAddress.rows[0]?.id || null;
    }

    if (!shippingAddressId) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Unable to resolve shipping address. Please save address again." });
    }

    const orderResult = await client.query(
      `INSERT INTO orders (
         order_number,
         user_id,
         shipping_address_id,
         subtotal,
         tax_amount,
         shipping_fee,
         total_amount,
         status,
         notes,
         expected_delivery,
         placed_at,
         updated_at
       )
       VALUES ($1, $2, $3, $4, 0, $5, $6, $7, $8, NOW() + INTERVAL '5 days', NOW(), NOW())
       RETURNING id, order_number`,
      [
        orderNumber,
        userId,
        shippingAddressId,
        subtotal,
        shippingFee,
        totalAmount,
        orderStatus,
        payment_reference ? `pay_ref:${payment_reference}` : null,
      ]
    );

    const order = orderResult.rows[0];

    // Some legacy products may not have seller_id set. Resolve a stable fallback user id.
    let fallbackSellerId = null;
    const fallbackSellerResult = await client.query(
      `SELECT id
       FROM users
       WHERE role IN ('seller', 'admin')
       ORDER BY id ASC
       LIMIT 1`
    );
    if (fallbackSellerResult.rows.length > 0) {
      fallbackSellerId = fallbackSellerResult.rows[0].id;
    } else {
      const anyUserResult = await client.query(
        `SELECT id
         FROM users
         ORDER BY id ASC
         LIMIT 1`
      );
      if (anyUserResult.rows.length > 0) {
        fallbackSellerId = anyUserResult.rows[0].id;
      }
    }

    for (const item of cartItems.rows) {
      const quantity = Number(item.quantity || 0);
      const unitPrice = Number(item.unit_price || 0);
      const itemTotal = unitPrice * quantity;

      let resolvedSellerId = item.seller_id || fallbackSellerId || userId;

      // Guard against stale seller references that no longer exist in users.
      const sellerExistsResult = await client.query(
        `SELECT 1 FROM users WHERE id = $1 LIMIT 1`,
        [resolvedSellerId]
      );
      if (sellerExistsResult.rows.length === 0) {
        resolvedSellerId = fallbackSellerId || null;
      }

      if (!resolvedSellerId) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          error: "No valid seller account found for one or more items.",
        });
      }

      await client.query(
        `INSERT INTO order_items (
           order_id,
           seller_id,
           variant_id,
           product_title,
           variant_attrs,
           quantity,
           unit_price,
           tax_percent,
           total_price,
           status,
           tracking_number,
           created_at,
           updated_at
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, 0, $8, $9, $10, NOW(), NOW())`,
        [
          order.id,
          resolvedSellerId,
          item.variant_id,
          item.title,
          item.attributes || {},
          quantity,
          unitPrice,
          itemTotal,
          orderStatus,
          makeTrackingNumber(),
        ]
      );
    }

    await client.query("DELETE FROM cart_items WHERE cart_id = $1", [cartId]);

    await client.query("COMMIT");

    return res.json({
      success: true,
      order_id: order.id,
      order_number: order.order_number,
      status: orderStatus,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("[orders/create]", err.message);
    return res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

router.post("/verify-payment", auth, async (req, res) => {
  try {
    // Placeholder success response until gateway webhook verification is added.
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Verification failed" });
  }
});

module.exports = router;
