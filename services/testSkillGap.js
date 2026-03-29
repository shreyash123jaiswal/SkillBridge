const { analyzeCareerPivot } = require("./career-pivot/pivotService");
const { generateRoadmap } = require("./learning-path/roadmapGenerator");

const userSkills = ["HTML", "CSS"];
const targetRole = "frontend developer";

const result = analyzeCareerPivot(userSkills, targetRole);

console.log("Career Pivot Result:", result);

const roadmap = generateRoadmap(result.missingSkills);

console.log("Learning Roadmap:", roadmap);
