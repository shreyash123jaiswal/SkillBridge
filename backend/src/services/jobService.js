// src/services/jobService.js
// Provides job data to controllers.
// In production, replace the static array with real DB / external API calls.

// ── Static job catalogue (mirrors the shape of the old trending.js) ───────────
const JOB_CATALOGUE = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechCorp India",
    location: "Bangalore, Karnataka",
    salary_range: "₹18L – ₹28L",
    match_percentage: 92,
    skills_required: ["React", "TypeScript", "Node.js", "GraphQL"],
    job_type: "Full-time",
    remote: true,
    posted_days_ago: 1,
  },
  {
    id: "2",
    title: "Machine Learning Engineer",
    company: "DataVision AI",
    location: "Hyderabad, Telangana",
    salary_range: "₹20L – ₹35L",
    match_percentage: 85,
    skills_required: ["Python", "TensorFlow", "PyTorch", "MLOps"],
    job_type: "Full-time",
    remote: false,
    posted_days_ago: 2,
  },
  {
    id: "3",
    title: "Full Stack Developer",
    company: "StartupHub",
    location: "Chennai, Tamil Nadu",
    salary_range: "₹12L – ₹20L",
    match_percentage: 88,
    skills_required: ["React", "Python", "PostgreSQL", "Docker"],
    job_type: "Full-time",
    remote: true,
    posted_days_ago: 3,
  },
  {
    id: "4",
    title: "DevOps Engineer",
    company: "CloudWave Technologies",
    location: "Pune, Maharashtra",
    salary_range: "₹15L – ₹25L",
    match_percentage: 78,
    skills_required: ["Kubernetes", "Terraform", "AWS", "CI/CD"],
    job_type: "Full-time",
    remote: true,
    posted_days_ago: 1,
  },
  {
    id: "5",
    title: "Data Scientist",
    company: "AnalyticsPro",
    location: "Mumbai, Maharashtra",
    salary_range: "₹16L – ₹30L",
    match_percentage: 80,
    skills_required: ["Python", "SQL", "Power BI", "Statistics"],
    job_type: "Full-time",
    remote: false,
    posted_days_ago: 4,
  },
  {
    id: "6",
    title: "Backend Developer (Node.js)",
    company: "FinTech Solutions",
    location: "Delhi, NCR",
    salary_range: "₹14L – ₹22L",
    match_percentage: 90,
    skills_required: ["Node.js", "Express", "MongoDB", "Redis"],
    job_type: "Full-time",
    remote: true,
    posted_days_ago: 2,
  },
  {
    id: "7",
    title: "iOS Developer",
    company: "AppForge",
    location: "Bangalore, Karnataka",
    salary_range: "₹12L – ₹20L",
    match_percentage: 70,
    skills_required: ["Swift", "Xcode", "UIKit", "CoreData"],
    job_type: "Contract",
    remote: false,
    posted_days_ago: 5,
  },
  {
    id: "8",
    title: "Product Manager – Tech",
    company: "InnovateCo",
    location: "Hyderabad, Telangana",
    salary_range: "₹22L – ₹40L",
    match_percentage: 65,
    skills_required: ["Agile", "Roadmapping", "SQL", "Figma"],
    job_type: "Full-time",
    remote: true,
    posted_days_ago: 7,
  },
];

/**
 * Returns all trending jobs, optionally filtered by a skill keyword.
 * @param {string} [skillFilter]
 * @returns {object[]}
 */
function getTrendingJobs(skillFilter) {
  if (!skillFilter) return JOB_CATALOGUE;
  const kw = skillFilter.toLowerCase();
  return JOB_CATALOGUE.filter((job) =>
    job.skills_required.some((s) => s.toLowerCase().includes(kw))
  );
}

/**
 * Returns a single job by id, or null if not found.
 * @param {string} id
 * @returns {object|null}
 */
function getJobById(id) {
  return JOB_CATALOGUE.find((j) => j.id === id) || null;
}

/**
 * Filters jobs whose required skills overlap with the provided skill list.
 * Useful for personalised job recommendations after resume analysis.
 * @param {string[]} skills
 * @param {number}   [limit=5]
 * @returns {object[]}
 */
function getRecommendedJobs(skills = [], limit = 5) {
  const normalised = skills.map((s) => s.toLowerCase());

  const scored = JOB_CATALOGUE.map((job) => {
    const overlap = job.skills_required.filter((req) =>
      normalised.some((s) => req.toLowerCase().includes(s))
    ).length;
    return { ...job, overlap };
  });

  return scored
    .filter((j) => j.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, limit);
}

module.exports = { getTrendingJobs, getJobById, getRecommendedJobs };
