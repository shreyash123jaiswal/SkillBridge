// src/routes/jobRoutes.js

const express = require("express");
const { getTrending, getJob, getRecommended } = require("../controllers/jobController");

const router = express.Router();

// GET  /api/jobs/trending            – trending job list (optionally ?skill=React)
router.get("/trending", getTrending);

// POST /api/jobs/recommended         – personalised recommendations by skill list
router.post("/recommended", getRecommended);

// GET  /api/jobs/:id                 – single job detail
router.get("/:id", getJob);

module.exports = router;
