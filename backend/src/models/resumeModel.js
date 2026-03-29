// src/models/resumeModel.js
// Persists resume upload records and AI analysis results.

const { v4: uuidv4 } = require("uuid");
const { query, getStore, isUsingFallback } = require("../config/db");

/**
 * Saves a resume upload record.
 * @returns {object} Persisted resume record
 */
async function saveResume({ userId, filename, filepath }) {
  if (isUsingFallback()) {
    const record = {
      id: uuidv4(),
      user_id: userId || null,
      filename,
      filepath,
      uploaded_at: new Date().toISOString(),
    };
    getStore().resumes.push(record);
    return record;
  }

  const { rows } = await query(
    `INSERT INTO resumes (user_id, filename, filepath)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [userId || null, filename, filepath]
  );
  return rows[0];
}

/**
 * Saves an AI analysis result linked to a resume.
 * @returns {object} Persisted analysis record
 */
async function saveAnalysis({ resumeId, skills, recommendedRoles, readinessScore }) {
  if (isUsingFallback()) {
    const record = {
      id: uuidv4(),
      resume_id: resumeId,
      skills,
      recommended_roles: recommendedRoles,
      readiness_score: readinessScore,
      created_at: new Date().toISOString(),
    };
    getStore().analyses.push(record);
    return record;
  }

  const { rows } = await query(
    `INSERT INTO analyses (resume_id, skills, recommended_roles, readiness_score)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [resumeId, JSON.stringify(skills), JSON.stringify(recommendedRoles), readinessScore]
  );
  return rows[0];
}

/**
 * Retrieves the latest analysis for a given user (in-memory: last entry).
 */
async function getLatestAnalysisByUserId(userId) {
  if (isUsingFallback()) {
    const store = getStore();
    const userResumes = store.resumes
      .filter((r) => r.user_id === userId)
      .map((r) => r.id);
    const analyses = store.analyses.filter((a) =>
      userResumes.includes(a.resume_id)
    );
    return analyses.at(-1) || null;
  }

  const { rows } = await query(
    `SELECT a.*
     FROM analyses a
     JOIN resumes r ON r.id = a.resume_id
     WHERE r.user_id = $1
     ORDER BY a.created_at DESC
     LIMIT 1`,
    [userId]
  );
  return rows[0] || null;
}

module.exports = { saveResume, saveAnalysis, getLatestAnalysisByUserId };
