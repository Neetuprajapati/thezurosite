const pool = require("../db");

// ✅ ADD TO WISHLIST
exports.addToWishlist = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { productId } = req.body;

    await pool.query(
      `INSERT INTO wishlists(user_id, product_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, product_id) DO NOTHING`,
      [user_id, productId]
    );

    res.json({ success: true });

  } catch (err) {
    console.error("ADD WISHLIST ERROR 👉", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ GET WISHLIST (IMPORTANT)
exports.getWishlist = async (req, res) => {
  try {
    const user_id = req.user.id;

    const result = await pool.query(`
      SELECT 
        w.id,
        p.id AS product_id,
        p.name,
        p.price,
        p.image
      FROM wishlists w
      JOIN products p ON w.product_id = p.id
      WHERE w.user_id = $1
      ORDER BY w.added_at DESC
    `, [user_id]);

    res.json(result.rows);

  } catch (err) {
    console.error("GET WISHLIST ERROR 👉", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ REMOVE FROM WISHLIST
exports.removeFromWishlist = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { productId } = req.params;

    await pool.query(
      `DELETE FROM wishlists 
       WHERE user_id = $1 AND product_id = $2`,
      [user_id, productId]
    );

    res.json({ success: true });

  } catch (err) {
    console.error("DELETE WISHLIST ERROR 👉", err);
    res.status(500).json({ message: "Server error" });
  }
};