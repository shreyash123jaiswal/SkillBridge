// src/controllers/dashboardController.js
// Aggregates data for the user's personalised dashboard.

const { getLatestAnalysisByUserId } = require("../models/resumeModel");
const { getRecommendedJobs } = require("../services/jobService");

// ── Skill progress benchmarks (static – can be moved to DB later) ─────────────
const SKILL_BENCHMARKS = {
  React: { target: 90, category: "Frontend" },
  "Node.js": { target: 85, category: "Backend" },
  Python: { target: 80, category: "AI/Data" },
  PostgreSQL: { target: 75, category: "Database" },
  Docker: { target: 70, category: "DevOps" },
};

/**
 * GET /api/dashboard
 * Returns aggregated stats for the authenticated user.
 */
async function getDashboard(req, res, next) {
  try {
    const userId = req.user?.id;

    // ── Retrieve latest resume analysis (if any) ──────────────────────────────
    const analysis = userId
      ? await getLatestAnalysisByUserId(userId)
      : null;

    const skills = analysis?.skills ?? [];
    const recommendedRoles = analysis?.recommended_roles ?? [];
    const jobReadinessScore = analysis?.readiness_score ?? 0;

    // ── Build skill progress list ─────────────────────────────────────────────
    const skillProgress = skills.map((skill) => {
      const benchmark = SKILL_BENCHMARKS[skill] || { target: 75, category: "General" };
      return {
        skill,
        category: benchmark.category,
        // Simulate a current proficiency score between 50-95
        current: Math.min(95, 50 + Math.floor(Math.random() * 45)),
        target: benchmark.target,
      };
    });

    // ── Recommended jobs based on extracted skills ────────────────────────────
    const recommendedJobs = getRecommendedJobs(skills, 3);

    // ── Overall progress metrics ──────────────────────────────────────────────
    const completedSkills = skillProgress.filter(
      (s) => s.current >= s.target
    ).length;

    return res.json({
      user: req.user
        ? { id: req.user.id, name: req.user.name, email: req.user.email }
        : null,
      skills,
      skill_progress: skillProgress,
      recommended_roles: recommendedRoles,
      recommended_jobs: recommendedJobs,
      job_readiness_score: jobReadinessScore,
      progress: {
        skills_identified: skills.length,
        skills_completed: completedSkills,
        skills_in_progress: skills.length - completedSkills,
        overall_percentage:
          skills.length > 0
            ? Math.round((completedSkills / skills.length) * 100)
            : 0,
      },
      has_resume: analysis !== null,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getDashboard };
