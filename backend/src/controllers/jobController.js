// src/controllers/jobController.js
// Handles all job-related API endpoints.

const { getTrendingJobs, getJobById, getRecommendedJobs } = require("../services/jobService");

/**
 * GET /api/jobs/trending
 * Returns the curated list of trending jobs, optionally filtered by a skill.
 */
function getTrending(req, res) {
  const { skill } = req.query; // e.g. /api/jobs/trending?skill=React
  const jobs = getTrendingJobs(skill);
  res.json({ count: jobs.length, jobs });
}

/**
 * GET /api/jobs/:id
 * Returns a single job by its id.
 */
function getJob(req, res) {
  const job = getJobById(req.params.id);
  if (!job) {
    return res.status(404).json({ error: `Job with id '${req.params.id}' not found` });
  }
  res.json({ job });
}

/**
 * POST /api/jobs/recommended
 * Body: { skills: string[] }
 * Returns jobs whose required skills match the provided list.
 */
function getRecommended(req, res) {
  const { skills = [] } = req.body;
  if (!Array.isArray(skills)) {
    return res.status(400).json({ error: "'skills' must be an array of strings" });
  }
  const jobs = getRecommendedJobs(skills);
  res.json({ count: jobs.length, jobs });
}

module.exports = { getTrending, getJob, getRecommended };
