const pool = require("../db");

exports.addToWishlist = async (req, res) => {
    const user_id = req.user.id;          
    const { productId } = req.body;       
  
    await pool.query(
      `INSERT INTO wishlists(user_id, product_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, product_id) DO NOTHING`,
      [user_id, productId]
    );
  
    res.json({ success: true });
  };