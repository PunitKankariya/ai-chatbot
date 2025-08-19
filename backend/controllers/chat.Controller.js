import { getAIResponse } from "../services/aiService.js";
import { chatHistoryService } from "../services/chatHistoryService.js";
import { v4 as uuidv4 } from "uuid";

export const handleChat = async (req, res, next) => {
  try {
    const { message, sessionId } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const currentSessionId = sessionId || uuidv4();
    const history = chatHistoryService.getHistory(currentSessionId);

    const reply = await getAIResponse(message, history);

    chatHistoryService.addMessage(currentSessionId, "user", message);
    chatHistoryService.addMessage(currentSessionId, "assistant", reply);

    res.json({
      reply,
      sessionId: currentSessionId,
      conversationLength: chatHistoryService.getHistory(currentSessionId).length,
    });
  } catch (err) {
    next(err);
  }
};

export const getChatHistory = (req, res, next) => {
  try {
    const { sessionId } = req.params;
    if (!sessionId) {
      return res.status(400).json({ error: "Session ID is required" });
    }

    const history = chatHistoryService.getHistory(sessionId);
    res.json({ sessionId, history, messageCount: history.length });
  } catch (err) {
    next(err);
  }
};

export const clearChatHistory = (req, res, next) => {
  try {
    const { sessionId } = req.params;
    if (!sessionId) {
      return res.status(400).json({ error: "Session ID is required" });
    }

    chatHistoryService.clearHistory(sessionId);
    res.json({ message: "Chat history cleared successfully", sessionId });
  } catch (err) {
    next(err);
  }
};
