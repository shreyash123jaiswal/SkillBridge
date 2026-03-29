function generateRoadmap(missingSkills) {
  return missingSkills.map((skill) => {
    let resource = "";

    switch (skill.toLowerCase()) {
      case "javascript":
        resource = "Learn JavaScript basics (MDN / YouTube)";
        break;
      case "react":
        resource = "Learn React (Official Docs / Tutorials)";
        break;
      case "git":
        resource = "Learn Git & GitHub (Version Control)";
        break;
      case "node.js":
        resource = "Learn Node.js backend development";
        break;
      case "mongodb":
        resource = "Learn MongoDB database basics";
        break;
      default:
        resource = `Learn ${skill} from online courses`;
    }

    return {
      skill,
      resource,
    };
  });
}

module.exports = { generateRoadmap };
