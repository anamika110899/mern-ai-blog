const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");

//  Step 1: Add node-fetch (important for Gemini API)
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
global.fetch = fetch; // make fetch available globally

dotenv.config();

console.log('Environment Variables:', {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI?.substring(0, 20) + '...',
  JWT_SECRET: process.env.JWT_SECRET?.substring(0, 5) + '...'
});

const app = express();

// Apply middleware
app.use(cors());
app.use(express.json());

// Register routes
console.log(" Registering routes...");
app.use("/api/auth", authRoutes);
app.use("/api/blog", blogRoutes);
console.log(" Routes registered successfully!");

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB Connected Successfully"))
  .catch((err) => console.error(" MongoDB Connection Error:", err));

const PORT = process.env.PORT || 5002;

// Test route
app.get("/api/test", (req, res) => {
  console.log(" Test route hit!");
  res.send("Test route working!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
  console.log(" Gemini API Key:", process.env.GEMINI_API_KEY ? "Present" : " Missing");
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server Error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please try a different port.`);
    process.exit(1);
  }
});
