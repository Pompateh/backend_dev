const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Brand = require("./models/Brand");
const Illustration = require("./models/Illustration");
const Product = require("./models/Product");
const Typeface = require("./models/Typeface");

const path = require("path"); // ✅ Import path module

const brandsData = require(path.join(__dirname, "data", "brands.json"));
const illustrationsData = require(path.join(__dirname, "data", "illustrations.json"));
const productsData = require(path.join(__dirname, "data", "products.json"));
const typefacesData = require(path.join(__dirname, "data", "typeface.json"));


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/newstalgia_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Seed data
const importData = async () => {
  try {
    await Brand.deleteMany();
    await Illustration.deleteMany();
    await Product.deleteMany();
    await Typeface.deleteMany();

    await Brand.insertMany(brandsData);
    await Illustration.insertMany(illustrationsData);
    await Product.insertMany(productsData);
    await Typeface.insertMany(typefacesData);

    console.log("✅ Data Imported Successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error with data import:", error);
    process.exit(1);
  }
};

importData();
