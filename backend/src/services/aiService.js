// src/services/aiService.js
// All HTTP calls to the Python FastAPI AI engine live here.
// Node backend NEVER performs any AI/ML logic – it only bridges data.

const axios = require("axios");

const AI_BASE = process.env.AI_SERVICE_URL || "http://localhost:8000";

// Shared axios instance with sensible defaults
const aiClient = axios.create({
  baseURL: AI_BASE,
  timeout: 60_000, // AI inference can be slow – allow up to 60 s
  headers: { "Content-Type": "application/json" },
});

// ── Response interceptor: surface AI errors clearly ───────────────────────────
aiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const detail = err.response?.data?.detail || err.message;

    if (err.code === "ECONNREFUSED") {
      throw Object.assign(new Error("AI service is offline"), {
        statusCode: 503,
      });
    }
    throw Object.assign(
      new Error(`AI service error (${status ?? "unknown"}): ${detail}`),
      { statusCode: status || 502 }
    );
  }
);

// ── Public helpers ─────────────────────────────────────────────────────────────

/**
 * Sends a resume file path to the AI engine for skill extraction.
 *
 * @param {string} filePath  Absolute or relative path on the shared filesystem
 * @returns {Promise<{ skills: string[], recommended_roles: string[], readiness_score: number }>}
 */
async function analyzeResume(filePath) {
  const { data } = await aiClient.post("/analyze", { file_path: filePath });
  return data;
}

/**
 * Asks the AI to compute what skills are missing for a career pivot.
 *
 * @param {string[]} currentSkills
 * @param {string}   targetRole
 * @returns {Promise<{ missing_skills: string[], readiness_score: number, difficulty: string }>}
 */
async function getCareerPivot(currentSkills, targetRole) {
  const { data } = await aiClient.post("/career-pivot", {
    current_skills: currentSkills,
    target_role: targetRole,
  });
  return data;
}

/**
 * Forwards a user message to the AI chatbot.
 *
 * @param {string} message
 * @param {Array}  [history=[]]  Previous turns [{ role, content }]
 * @returns {Promise<{ reply: string }>}
 */
async function chat(message, history = []) {
  const { data } = await aiClient.post("/chat", { message, history });
  return data;
}

/**
 * Health-check – lets the backend verify the AI engine is reachable.
 * @returns {Promise<boolean>}
 */
async function ping() {
  try {
    await aiClient.get("/health");
    return true;
  } catch {
    return false;
  }
}

module.exports = { analyzeResume, getCareerPivot, chat, ping };




