const { findSkillGap } = require("./skillGapAnalyzer");
const { calculateReadiness } = require("./readinessCalculator");
const roles = require("../data/roleSkills.json");

function analyzeCareerPivot(userSkills, targetRole) {
  const targetSkills = roles[targetRole];

  if (!targetSkills) {
    return {
      error: "Target role not found",
    };
  }

  const missingSkills = findSkillGap(userSkills, targetSkills);
  const readiness = calculateReadiness(userSkills, targetSkills);

  let difficulty = "Easy";

  if (readiness < 40) difficulty = "Hard";
  else if (readiness < 70) difficulty = "Medium";

  return {
    targetRole,
    missingSkills,
    readiness: readiness.toFixed(2),
    difficulty,
  };
}

module.exports = { analyzeCareerPivot };
