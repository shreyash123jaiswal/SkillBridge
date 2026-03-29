// src/routes/dashboardRoutes.js

const express = require("express");
const { getDashboard } = require("../controllers/dashboardController");
const { optionalAuth } = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/dashboard
// optionalAuth → returns richer data if user is logged in, generic data otherwise
router.get("/", optionalAuth, getDashboard);

module.exports = router;
