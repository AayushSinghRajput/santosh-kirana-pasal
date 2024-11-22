const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const Joi = require("joi");
const cors = require("cors");
require("dotenv").config(); // To use environment variables from a .env file
const jwtSecret = process.env.JWT_SECRET;

// Initialize express app
const app = express();

// Middleware setup
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(bodyParser.json()); // For parsing application/json

// MongoDB connection using environment variables
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/santoshkiranapasal";

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit the process if the database connection fails
  });

// Define a schema for the contact form
const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"] },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [/.+@.+\..+/, "Invalid email format"],
    },
    message: { type: String, required: [true, "Message is required"] },
  },
  { timestamps: true }
); // Add timestamps for createdAt and updatedAt

// Define a schema for the service form
const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"] },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [/.+@.+\..+/, "Invalid email format"],
    },
    message: { type: String, required: [true, "Message is required"] },
  },
  { timestamps: true }
);

// Create models based on the schemas
const Contact = mongoose.model("Contact", contactSchema);
const Service = mongoose.model("Service", serviceSchema);

// Route for submitting contact messages
app.post("/submit-contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newContact = new Contact({ name, email, message });
    await newContact.save();
    res.status(200).json({ message: "Contact message stored successfully!" });
  } catch (err) {
    console.error("Error storing contact message:", err);
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
});

// Route for submitting service messages
app.post("/submit-service", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newService = new Service({ name, email, message });
    await newService.save();
    res.status(200).json({ message: "Service message stored successfully!" });
  } catch (err) {
    console.error("Error storing service message:", err);
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
});

// Define the user schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);

// Signup route
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email, and password are required." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User signed up successfully!" });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      res.status(400).json({ error: "Email already exists!" });
    } else {
      res.status(500).json({ error: "Failed to create user." });
    }
  }
});

// Login route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password!" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password!" });
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret, {
      expiresIn: "1h",
    });
    res.status(200).json({ message: "User logged in successfully!", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to login user." });
  }
});

// Authentication middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized!" });

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token!" });
  }
};

// Handle undefined routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "An unexpected error occurred" });
});

// Set the server to listen on a port
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
