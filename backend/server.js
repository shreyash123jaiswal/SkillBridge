// server.js
// Entry point – connects to the database (or activates fallback) then starts
// the HTTP server.  Keep this file thin; all logic lives in src/.
console.log("ENV CHECK:", process.env.DATABASE_URL);
require("dotenv").config({ path: __dirname + "/.env" });

const app = require("./src/app");
const { connectDB } = require("./src/config/db");
const { ping: pingAI } = require("./src/services/aiService");

const PORT = parseInt(process.env.PORT || "5000", 10);

async function start() {
  // 1. Database connection (falls back to in-memory if unavailable)
  await connectDB();

  // 2. Non-blocking AI service health-check
  pingAI().then((alive) => {
    if (alive) {
      console.log(`✅  Python AI service reachable at ${process.env.AI_SERVICE_URL || "http://localhost:8000"}`);
    } else {
      console.warn(
        `⚠️  Python AI service NOT reachable at ${process.env.AI_SERVICE_URL || "http://localhost:8000"} – resume analysis and chat will return fallback responses until it is online`
      );
    }
  });

  // 3. Start Express
  app.listen(PORT, () => {
    console.log(`\n🚀  SkillBridge backend running on http://localhost:${PORT}`);
    console.log(`   Health check → http://localhost:${PORT}/health`);
    console.log(`   API base     → http://localhost:${PORT}/api\n`);
  });
}

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received – shutting down gracefully");
  process.exit(0);
});
process.on("SIGINT", () => {
  console.log("SIGINT received – shutting down gracefully");
  process.exit(0);
});

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
