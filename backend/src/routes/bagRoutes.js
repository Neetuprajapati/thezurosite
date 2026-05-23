const express = require("express");
const router  = express.Router();
const pool    = require("../db");
const auth    = require("../middleware/auth");

// helper — get or create cart for user
const getOrCreateCart = async (userId) => {
  let result = await pool.query(
    `SELECT id FROM carts WHERE user_id = $1`, [userId]
  );
  if (result.rows.length > 0) return result.rows[0].id;

  result = await pool.query(
    `INSERT INTO carts (user_id) VALUES ($1) RETURNING id`, [userId]
  );
  return result.rows[0].id;
};

// GET /api/bag/count
router.get("/count", auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT COALESCE(SUM(ci.quantity), 0)::int AS count
      FROM carts c
      JOIN cart_items ci ON ci.cart_id = c.id
      WHERE c.user_id = $1
    `, [req.user.id]);
    res.json({ count: result.rows[0].count });
  } catch (err) {
    res.status(500).json({ count: 0 });
  }
});

// GET /api/bag — full cart with product details
router.get("/", auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        ci.id,
        ci.quantity,
        ci.unit_price::float,
        pv.id           AS variant_id,
        pv.attributes,
        pv.sku,
        p.id            AS product_id,
        p.title,
        p.brand,
        p.base_price::float,
        p.sale_price::float,
        (SELECT pm.media_url FROM product_media pm
         WHERE pm.product_id = p.id AND pm.is_primary = true LIMIT 1) AS image_url
      FROM carts c
      JOIN cart_items ci ON ci.cart_id = c.id
      JOIN product_variants pv ON pv.id = ci.variant_id
      JOIN products p ON p.id = pv.product_id
      WHERE c.user_id = $1
      ORDER BY ci.added_at DESC
    `, [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    console.error("[bag/get]", err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/bag — add item { variantId, quantity }
router.post("/", auth, async (req, res) => {
  try {
    const { variantId, quantity = 1 } = req.body;
    const cartId = await getOrCreateCart(req.user.id);

    // get current price
    const variant = await pool.query(
      `SELECT COALESCE(price_override, p.sale_price, p.base_price)::float AS price
       FROM product_variants pv
       JOIN products p ON p.id = pv.product_id
       WHERE pv.id = $1`, [variantId]
    );
    if (variant.rows.length === 0)
      return res.status(404).json({ error: "Variant not found" });

    const unitPrice = variant.rows[0].price;

    await pool.query(`
      INSERT INTO cart_items (cart_id, variant_id, quantity, unit_price)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (cart_id, variant_id)
      DO UPDATE SET
        quantity   = cart_items.quantity + $3,
        unit_price = $4,
        updated_at = NOW()
    `, [cartId, variantId, quantity, unitPrice]);

    res.json({ success: true });
  } catch (err) {
    console.error("[bag/add]", err.message);
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/bag/:itemId — update quantity { quantity }
router.patch("/:itemId", auth, async (req, res) => {
  try {
    const { quantity } = req.body;
    if (quantity < 1) return res.status(400).json({ error: "Invalid quantity" });

    await pool.query(`
      UPDATE cart_items ci SET quantity = $1
      FROM carts c
      WHERE ci.cart_id = c.id AND c.user_id = $2 AND ci.id = $3
    `, [quantity, req.user.id, req.params.itemId]);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/bag/:itemId
router.delete("/:itemId", auth, async (req, res) => {
  try {
    await pool.query(`
      DELETE FROM cart_items ci
      USING carts c
      WHERE ci.cart_id = c.id AND c.user_id = $1 AND ci.id = $2
    `, [req.user.id, req.params.itemId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;