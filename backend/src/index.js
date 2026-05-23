require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

app.use("/api/auth",     require("./routes/auth"));
app.use("/api/user",     require("./routes/user"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/bag",      require("./routes/bagRoutes"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));

app.listen(5000, () => {
  console.log("✅ Server running on https://api.thezuro.com");
});