const express = require("express");
const router = express.Router();
const db = require("../db");
const verifyToken = require("../middleware/auth");

// GET /api/user/profile
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, full_name AS name, email, phone, gender, dob FROM users WHERE id = ?",
      [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: "User not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/user/update
router.put("/update", verifyToken, async (req, res) => {
  try {
    const { name, email, phone, gender, dob } = req.body;
    await db.query(
      "UPDATE users SET full_name=?, email=?, phone=?, gender=?, dob=? WHERE id=?",
      [name, email, phone, gender, dob, req.user.id]
    );
    const [rows] = await db.query(
      "SELECT id, full_name AS name, email, phone, gender, dob FROM users WHERE id = ?",
      [req.user.id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;