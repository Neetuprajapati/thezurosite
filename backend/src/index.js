require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// Prevent conditional GET 304 for API JSON responses.
app.set("etag", false);

const allowedOrigins = (process.env.CORS_ORIGINS || process.env.FRONTEND_URL || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth",     require("./routes/auth"));
app.use("/api/user",     require("./routes/user"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/bag",      require("./routes/bagRoutes"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/orders",   require("./routes/orders"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");

// const app = express();

// app.use(cors({ 
//   origin: ["https://www.thezuro.com", "https://thezuro.com"],
//   credentials: true 
// }));
// app.use(express.json());

// app.use("/api/auth",     require("./routes/auth"));
// app.use("/api/user",     require("./routes/user"));
// app.use("/api/products", require("./routes/productRoutes"));
// app.use("/api/bag",      require("./routes/bagRoutes"));
// app.use("/api/wishlist", require("./routes/wishlistRoutes"));
// app.use("/api/contact",  require("./routes/contactRoutes"));

// app.listen(5000, () => {
//   console.log("✅ Server running on https://api.thezuro.com");
// });