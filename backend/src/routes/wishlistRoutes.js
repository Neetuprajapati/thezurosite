const express = require("express");
const router  = express.Router();
const pool    = require("../db");
const auth    = require("../middleware/auth");

// GET /api/wishlist — full wishlist with product details
router.get("/", auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        w.id,
        p.id          AS product_id,
        p.title,
        p.brand,
        p.base_price::float,
        p.sale_price::float,
        p.rating::float,
        p.review_count,
        (SELECT pm.media_url FROM product_media pm
         WHERE pm.product_id = p.id AND pm.is_primary = true LIMIT 1) AS image_url
      FROM wishlists w
      JOIN products p ON p.id = w.product_id
      WHERE w.user_id = $1
      ORDER BY w.added_at DESC
    `, [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    console.error("[wishlist/get]", err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/wishlist/count
router.get("/count", auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT COUNT(*)::int AS count FROM wishlists WHERE user_id = $1`,
      [req.user.id]
    );
    res.json({ count: result.rows[0].count });
  } catch (err) {
    res.status(500).json({ count: 0 });
  }
});

// GET /api/wishlist/ids — just product IDs (for heart icon state)
router.get("/ids", auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT product_id FROM wishlists WHERE user_id = $1`,
      [req.user.id]
    );
    res.json(result.rows.map(r => r.product_id));
  } catch (err) {
    res.status(500).json([]);
  }
});

// POST /api/wishlist — add item { productId }
router.post("/", auth, async (req, res) => {
  try {
    const { productId } = req.body;
    await pool.query(
      `INSERT INTO wishlists (user_id, product_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, product_id) DO NOTHING`,
      [req.user.id, productId]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("[wishlist/add]", err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/wishlist/:productId
router.delete("/:productId", auth, async (req, res) => {
  try {
    await pool.query(
      `DELETE FROM wishlists WHERE user_id = $1 AND product_id = $2`,
      [req.user.id, req.params.productId]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("[wishlist/delete]", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;