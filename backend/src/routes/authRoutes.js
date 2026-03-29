// src/routes/authRoutes.js
// Provides register / login so the frontend can obtain JWT tokens.

const express = require("express");
const bcrypt = require("bcryptjs");
const { createUser, findUserByEmail } = require("../models/userModel");
const { signToken } = require("../middleware/authMiddleware");

const router = express.Router();

// POST /api/auth/register
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "name, email and password are required" });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    const user = await createUser({ name, email, password });
    const token = signToken(user.id);

    return res.status(201).json({
      message: "Account created successfully",
      token,
      user,
    });
  } catch (err) {
    if (err.statusCode === 409 || err.code === "23505") {
      return res.status(409).json({ error: "Email already registered" });
    }
    next(err);
  }
});

// POST /api/auth/login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const { password: _pw, ...safeUser } = user;
    const token = signToken(user.id);

    return res.json({
      message: "Login successful",
      token,
      user: safeUser,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
