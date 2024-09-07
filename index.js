const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();

// Create an Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json()); // For parsing application/json


// Route files
const userRoutes = require("./routes/users");
const bookRoutes = require("./routes/books");
const transactionRoutes = require("./routes/transactions");

// Routes
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/transactions", transactionRoutes);

// Home route (optional)
app.get("/", (req, res) => {
  res.send("Welcome to the Book Rental API");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
