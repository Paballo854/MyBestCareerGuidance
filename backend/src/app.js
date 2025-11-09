const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { initializeCollections } = require("./config/firebase");
const errorHandler = require("./middleware/errorHandler");
const routes = require("./routes");

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
    origin: true, // Allow all origins for development
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan("combined"));

// Initialize Firebase collections on startup
initializeCollections().catch(console.error);

// Routes
app.use("/api", routes);

// Health check route
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "My Best Career Guidance API is running",
        timestamp: new Date().toISOString(),
        database: "Firebase Firestore"
    });
});

// Test route
app.get("/api/test", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Backend is working perfectly!",
        system: "My Best Career Guidance Platform"
    });
});

// Database test route
app.get("/api/test-db", async (req, res) => {
    try {
        const { db } = require("./config/firebase");
        const testRef = db.collection("test");
        await testRef.doc("connection").set({
            test: true,
            message: "Firebase connection successful",
            timestamp: new Date().toISOString()
        });

        res.status(200).json({
            success: true,
            message: "Firebase database is working!",
            system: "My Best Career Guidance Platform"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Database connection failed",
            error: error.message
        });
    }
});

// Error handler (should be last)
app.use(errorHandler);

module.exports = app;
