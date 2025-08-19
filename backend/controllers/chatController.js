// backend/controllers/chatController.js
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

// Support both env var names
const API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export const chatWithGemini = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!API_KEY) {
      return res.status(500).json({ error: "Missing API key. Set GEMINI_API_KEY or GOOGLE_API_KEY in .env" });
    }

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Combine conversation history with the new message
    const safeHistory = Array.isArray(history) ? history : [];
    const context = safeHistory
      .map((m) => `${m.role}: ${m.content}`)
      .join("\n");

    const prompt = `${context}\nUser: ${message}`;

    // Call Gemini API
    const result = await model.generateContent(prompt);
    const reply = result?.response?.text?.() || "";
    res.json({ reply });
  } catch (err) {
    console.error("🔥 Gemini API Error:", err?.message || err);
    res.status(500).json({
      error: `Gemini API Error: ${err?.message || "Unknown error"}`
    });
  }
};
