// src/routes/chatRoutes.js

const express = require("express");
const { handleChat } = require("../controllers/chatController");
const { optionalAuth } = require("../middleware/authMiddleware");

const router = express.Router();

// POST /api/chat
router.post("/", optionalAuth, handleChat);

module.exports = router;
