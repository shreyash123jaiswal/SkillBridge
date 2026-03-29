// src/controllers/resumeController.js
// Handles resume upload requests.  All AI processing is delegated to aiService.

const path = require("path");
const { analyzeResume } = require("../services/aiService");
const { saveResume, saveAnalysis } = require("../models/resumeModel");
const { getRecommendedJobs } = require("../services/jobService");

/**
 * POST /api/upload-resume
 * Accepts a PDF or DOC file, sends it to the AI engine, persists results,
 * and returns skills + recommended roles to the frontend.
 */
async function uploadResume(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded. Please attach a PDF or DOC." });
    }

    const { originalname, path: filepath, size } = req.file;

    // 1. Persist the raw upload record
    const userId = req.user?.id || null;
    const resumeRecord = await saveResume({
      userId,
      filename: originalname,
      filepath: path.resolve(filepath),
    });

    // 2. Delegate AI analysis to Python FastAPI
    let aiResult;
    try {
      aiResult = await analyzeResume(path.resolve(filepath));
    } catch (aiErr) {
      // AI service offline – return a graceful fallback so the frontend doesn't break
      console.error("AI service error during resume analysis:", aiErr.message);
      aiResult = {
        skills: [],
        recommended_roles: [],
        readiness_score: 0,
        warning: "AI service is temporarily unavailable. Results will appear once it is restored.",
      };
    }

    const { skills = [], recommended_roles = [], readiness_score = 0 } = aiResult;

    // 3. Persist analysis result
    const analysis = await saveAnalysis({
      resumeId: resumeRecord.id,
      skills,
      recommendedRoles: recommended_roles,
      readinessScore: readiness_score,
    });

    // 4. Pull matching jobs from the job service
    const matchedJobs = getRecommendedJobs(skills);

    return res.status(200).json({
      message: "Resume analysed successfully",
      resume: {
        id: resumeRecord.id,
        filename: originalname,
        size_bytes: size,
      },
      analysis: {
        id: analysis.id,
        skills,
        recommended_roles,
        readiness_score,
      },
      recommended_jobs: matchedJobs,
      ...(aiResult.warning ? { warning: aiResult.warning } : {}),
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { uploadResume };
