import express from "express";
import { handleChat, getChatHistory, clearChatHistory } from "../controllers/chat.controller.js";

const router = express.Router();

router.post("/", handleChat);

router.get("/:sessionId/history", getChatHistory);

router.delete("/:sessionId/history", clearChatHistory);

export default router;
