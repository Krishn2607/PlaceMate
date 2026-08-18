const express = require("express");

const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");

const app = express();

// Middleware

app.use(cors());

app.use(express.json());

// Test Route

app.get("/", (req, res) => {
    res.json({
        message: "PlaceMate Backend is running!"
    });
});

// Authentication Routes

app.use("/api/v1/auth", authRoutes);

// Project Routes

app.use("/api/v1/projects", projectRoutes);

module.exports = app;