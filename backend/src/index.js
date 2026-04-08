const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require("./auth");
app.use("/", authRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});