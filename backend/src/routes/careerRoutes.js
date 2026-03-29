// src/routes/careerRoutes.js

const express = require("express");
const { careerPivot } = require("../controllers/careerController");
const { optionalAuth } = require("../middleware/authMiddleware");

const router = express.Router();

// POST /api/career-pivot
router.post("/", optionalAuth, careerPivot);

module.exports = router;
