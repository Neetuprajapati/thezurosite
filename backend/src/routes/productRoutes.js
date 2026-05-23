// const express = require("express");
// const router = express.Router();
// const productController = require("../controllers/productController");

// router.get("/", productController.getProducts);
// router.get("/:id", productController.getProductById);

// module.exports = router;

const express = require("express");
const router = express.Router();
const productController = require("../controller/productController"); // ← no 's'

router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);

module.exports = router;