// src/middleware/authMiddleware.js
// Verifies the Authorization: Bearer <token> header on protected routes.

const jwt = require("jsonwebtoken");
const { findUserById } = require("../models/userModel");

/**
 * Mandatory auth – request is rejected if token is missing or invalid.
 */
async function requireAuth(req, res, next) {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({ error: "Authentication token required" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await findUserById(payload.id);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user; // attach user to request for downstream handlers
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired – please log in again" });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    next(err);
  }
}

/**
 * Optional auth – attaches user if token is present but never blocks the request.
 */
async function optionalAuth(req, res, next) {
  try {
    const token = extractToken(req);
    if (token) {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await findUserById(payload.id);
    }
  } catch {
    // Ignore auth errors – request continues unauthenticated
  }
  next();
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function extractToken(req) {
  const auth = req.headers.authorization || "";
  if (auth.startsWith("Bearer ")) return auth.slice(7);
  return null;
}

/**
 * Generates a signed JWT for the given user id.
 */
function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

module.exports = { requireAuth, optionalAuth, signToken };
