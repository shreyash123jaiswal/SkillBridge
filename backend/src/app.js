// src/app.js
// Express application factory – middleware stack + route mounting.
// Kept separate from server.js so the app can be imported in tests without
// binding to a port.

const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// ── Route modules ─────────────────────────────────────────────────────────────
const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const jobRoutes = require("./routes/jobRoutes");
const careerRoutes = require("./routes/careerRoutes");
const chatRoutes = require("./routes/chatRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ── Body parsers ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ── Static – serve uploaded files (optional, useful in dev) ──────────────────
const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || "uploads");
app.use("/uploads", express.static(UPLOAD_DIR));

// ── Request logger (development) ──────────────────────────────────────────────
if (process.env.NODE_ENV !== "production") {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// ── Health-check (no auth required) ──────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "skillbridge-backend", timestamp: new Date().toISOString() });
});

// Optional root endpoint for API base path (helpful for debugging)
app.get("/api", (_req, res) => {
  res.json({ status: "ok", api: "skillbridge", endpoints: ["/api/chat", "/api/upload-resume", "/api/jobs", "/api/career-pivot"] });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/upload-resume", resumeRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/career-pivot", careerRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/dashboard", dashboardRoutes);

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// ── Global error handler ──────────────────────────────────────────────────────
// Must have exactly four parameters for Express to treat it as an error handler.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // Multer-specific errors
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      error: "File too large",
      message: `Maximum allowed size is ${process.env.MAX_FILE_SIZE_MB || 10} MB`,
    });
  }

  const statusCode = err.statusCode || err.status || 500;
  const message =
    process.env.NODE_ENV === "production" && statusCode === 500
      ? "Internal server error"
      : err.message || "Internal server error";

  console.error(`[ERROR] ${statusCode} – ${err.message}`);
  if (statusCode === 500) console.error(err.stack);

  res.status(statusCode).json({ error: message });
});

module.exports = app;
