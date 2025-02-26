const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Fix MongoDB Connection (Use correct DB name)
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/newstalgia_db";

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Fix Port (Match frontend expectations)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

const brandRoutes = require("./routes/brands");
const illustrationRoutes = require("./routes/illustrations");
const productRoutes = require("./routes/products");
const typefaceRoutes = require("./routes/typefaces");

app.use("/api/brands", brandRoutes);
app.use("/api/illustrations", illustrationRoutes);
app.use("/api/products", productRoutes);
app.use("/api/typefaces", typefaceRoutes);
app.use(express.static("public"));

