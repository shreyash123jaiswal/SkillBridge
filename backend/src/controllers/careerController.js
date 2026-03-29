// src/controllers/careerController.js
// Handles career pivot / transition analysis.

const { getCareerPivot } = require("../services/aiService");

/**
 * POST /api/career-pivot
 * Body: { currentSkills: string[], targetRole: string }
 *
 * Delegates to the Python AI engine and returns:
 *   { missingSkills, readinessScore, difficulty, learningRoadmap }
 */
async function careerPivot(req, res, next) {
  try {
    const { currentSkills, targetRole } = req.body;

    // ── Validation ────────────────────────────────────────────────────────────
    if (!targetRole || typeof targetRole !== "string" || !targetRole.trim()) {
      return res.status(400).json({ error: "'targetRole' is required and must be a non-empty string" });
    }
    if (!Array.isArray(currentSkills) || currentSkills.length === 0) {
      return res.status(400).json({ error: "'currentSkills' must be a non-empty array of strings" });
    }

    // ── Delegate to AI service ────────────────────────────────────────────────
    let aiResult;
    try {
      aiResult = await getCareerPivot(currentSkills, targetRole.trim());
    } catch (aiErr) {
      console.error("AI service error during career pivot:", aiErr.message);
      // Graceful fallback – return placeholder data with a warning
      return res.status(503).json({
        error: "AI service is temporarily unavailable",
        detail: aiErr.message,
      });
    }

    const {
      missing_skills: missingSkills = [],
      readiness_score: readinessScore = 0,
      difficulty = "Unknown",
      learning_roadmap: learningRoadmap = [],
    } = aiResult;

    return res.json({
      targetRole: targetRole.trim(),
      currentSkills,
      missingSkills,
      readinessScore,
      difficulty,
      learningRoadmap,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { careerPivot };
