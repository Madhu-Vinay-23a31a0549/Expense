const express = require("express");
const pool = require("./config/db");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/auth.routes");
require("dotenv").config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend files
app.use(express.static(path.join(__dirname, "../frontend")));

// Test route
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Expense Tracker API is running"
  });
});

app.get("/api/db-test", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result");

    res.json({
      success: true,
      message: "Database connected successfully",
      result: rows[0].result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message
    });
  }
});

// Page route for login page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.use("/api/auth", authRoutes);

// 404 route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});