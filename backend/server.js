const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const expenseRoutes = require("./routes/expense.routes");
require("dotenv").config();

const app = express();

// Connect MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend files
app.use(express.static(path.join(__dirname, "../frontend")));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

// Health route
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Expense Tracker API is running"
  });
});

// DB test route
app.get("/api/db-test", (req, res) => {
  res.json({
    success: true,
    message: "MongoDB route is working"
  });
});

// Login page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

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