require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// Prevent conditional GET 304 for API JSON responses.
app.set("etag", false);

const normalizeOrigin = (value) => String(value || "").trim().replace(/\/$/, "").toLowerCase();

const defaultAllowedOrigins = [
  // "http://localhost:3000",
  "https://thezuro.com",
  "https://www.thezuro.com",
].map(normalizeOrigin);

const configuredOrigins = (process.env.CORS_ORIGINS || process.env.FRONTEND_URL || "")
  .split(",")
  .map(normalizeOrigin)
  .filter(Boolean);

// Merge defaults with configured origins so one env value doesn't accidentally block another valid domain.
const allowedOrigins = Array.from(new Set([...defaultAllowedOrigins, ...configuredOrigins]));

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    const normalizedOrigin = normalizeOrigin(origin);

    if (allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
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