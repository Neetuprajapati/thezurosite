const express = require("express");
const router = express.Router();
const db = require("../db");
const verifyToken = require("../middleware/auth");


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

module.exports = router;