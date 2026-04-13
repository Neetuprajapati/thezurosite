require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const express = require("express");
const cors    = require("cors");
const app     = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "TheZuro API running ✅" });
});

const authRoutes = require("./auth");
app.use("/api/auth", authRoutes);

app.listen(5000, () => {
  console.log("✅ Server running on http://localhost:5000");
});