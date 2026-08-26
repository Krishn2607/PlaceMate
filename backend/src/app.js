const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const certificationRoutes = require("./routes/certificationRoutes");
const codingProfileRoutes = require("./routes/codingProfileRoutes");
const codingProblemRoutes = require("./routes/codingProblemRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const studentRoutes = require("./routes/studentRoutes");
const weeklyPlanRoutes = require("./routes/weeklyPlanRoutes");
const progressSnapshotRoutes = require("./routes/progressSnapshotRoutes");

const app = express();

// Request logger
app.use((req, res, next) => {
    console.log("REQUEST:", req.method, req.originalUrl);
    next();
});

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
    res.json({
        message: "PlaceMate Backend is running!"
    });
});

// Student Routes
app.use("/api/v1/students", studentRoutes);

// Authentication Routes
app.use("/api/v1/auth", authRoutes);

// Project Routes
app.use("/api/v1/projects", projectRoutes);

// Certification Routes
app.use("/api/v1/certifications", certificationRoutes);

// Coding Profile Routes
app.use("/api/v1/coding-profiles", codingProfileRoutes);

// Coding Problem Routes
app.use("/api/v1/coding-problems", codingProblemRoutes);

// Resume Routes
app.use("/api/v1/resumes", resumeRoutes);

// Weekly Plan Routes
app.use( "/api/v1/weekly-plans", weeklyPlanRoutes);

// Progress Snapshot Routes
app.use("/api/v1/progress-snapshots",progressSnapshotRoutes);

module.exports = app;