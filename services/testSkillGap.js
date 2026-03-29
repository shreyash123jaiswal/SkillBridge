const { analyzeCareerPivot } = require("./career-pivot/pivotService");

const userSkills = ["HTML", "CSS"];
const targetRole = "frontend developer";

const result = analyzeCareerPivot(userSkills, targetRole);

console.log("Career Pivot Result:", result);
