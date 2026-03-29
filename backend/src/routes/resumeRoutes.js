// src/routes/resumeRoutes.js

const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { uploadResume } = require("../controllers/resumeController");
const { optionalAuth } = require("../middleware/authMiddleware");

const router = express.Router();

// ── Multer configuration ──────────────────────────────────────────────────────
const UPLOAD_DIR = path.resolve(
  process.env.UPLOAD_DIR || "uploads"
);

// Ensure the upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const fileFilter = (_req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      Object.assign(
        new Error("Invalid file type. Only PDF and DOC/DOCX files are accepted."),
        { statusCode: 415 }
      ),
      false
    );
  }
};

const MAX_SIZE_BYTES =
  parseInt(process.env.MAX_FILE_SIZE_MB || "10", 10) * 1024 * 1024;

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE_BYTES },
});

// ── Routes ────────────────────────────────────────────────────────────────────

// POST /api/upload-resume
router.post(
  "/",
  optionalAuth,           // attach user if logged in (not required)
  upload.single("resume"), // field name expected from frontend FormData
  uploadResume
);

module.exports = router;
