const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const multer = require('multer');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads'); // Folder for uploads
  },
  filename: function (req, file, cb) {
    // Create a unique filename using the current timestamp and original filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Create the upload endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    // Construct the URL to access the uploaded file
    const filePath = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    res.json({ filePath });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Fix MongoDB Connection (Use correct DB name)
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://heetranwork:31122000h@cluster0.x8whi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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


