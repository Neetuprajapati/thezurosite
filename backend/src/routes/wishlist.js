const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const {
  addToWishlist,
  getWishlist,
  removeFromWishlist
} = require("../controllers/wishlistController");

// GET all wishlist items
router.get("/", verifyToken, getWishlist);

// ADD item
router.post("/", verifyToken, addToWishlist);

// REMOVE item
router.delete("/:productId", verifyToken, removeFromWishlist);

module.exports = router;