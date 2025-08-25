// backend/controllers/chatController.js
import { getAIResponse } from "../services/aiService.js";

export const chatHandler = async (req, res) => {
  try {
    console.log('Received request body:', JSON.stringify(req.body, null, 2));
    const { message, history = [], useRag = false } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "'message' is required (string)" });
    }

    console.log(`[chatHandler] Using model: ${useRag ? "RAG" : "Gemini"}`);

    console.log('Calling getAIResponse with:', { message, historyLength: history.length, useRag });
    const reply = await getAIResponse(message, history, useRag);
    console.log('Received reply:', reply);
    return res.json({ reply, model: useRag ? "RAG" : "Gemini" });
  } catch (err) {
    console.error("[chatHandler] Error:", err);
    console.error('Error stack:', err.stack);
    return res.status(500).json({ 
      error: err?.message || "Internal Server Error",
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};
