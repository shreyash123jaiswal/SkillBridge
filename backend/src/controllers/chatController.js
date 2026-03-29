// src/controllers/chatController.js
// Proxies user chat messages to the Python AI chatbot.

const { chat } = require("../services/aiService");

/**
 * POST /api/chat
 * Body: { message: string, history?: Array<{ role: string, content: string }> }
 *
 * Returns: { reply: string }
 */
async function handleChat(req, res, next) {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "'message' is required and must be a non-empty string" });
    }

    if (!Array.isArray(history)) {
      return res.status(400).json({ error: "'history' must be an array when provided" });
    }

    let reply;
    try {
      const aiResponse = await chat(message.trim(), history);
      reply = aiResponse.reply || aiResponse.message || "Sorry, I could not generate a response.";
    } catch (aiErr) {
      console.error("AI chat error:", aiErr.message);
      if (aiErr.statusCode === 503) {
        return res.status(503).json({
          error: "Chat service is temporarily unavailable. Please try again shortly.",
        });
      }
      throw aiErr;
    }

    return res.json({ reply });
  } catch (err) {
    next(err);
  }
}

module.exports = { handleChat };
