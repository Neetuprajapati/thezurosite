const express = require("express");
const router = express.Router();
const pool = require("../db");
const auth = require("../middleware/auth");

// ➕ ADD TO WISHLIST
router.post("/add", auth, async (req, res) => {
  const { productId } = req.body;

  await pool.query(
    "INSERT INTO wishlists (user_id, product_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
    [req.user.id, productId]
  );

  res.json({ message: "Added to wishlist" });
});

// 📦 GET WISHLIST
router.get("/", auth, async (req, res) => {
  const result = await pool.query(`
    SELECT p.* FROM wishlists w
    JOIN products p ON p.id = w.product_id
    WHERE w.user_id = $1
  `, [req.user.id]);

  res.json(result.rows);
});

// 🔢 COUNT
router.get("/count", auth, async (req, res) => {
  const result = await pool.query(
    "SELECT COUNT(*) FROM wishlists WHERE user_id = $1",
    [req.user.id]
  );

  res.json({ count: parseInt(result.rows[0].count) });
});

module.exports = router;