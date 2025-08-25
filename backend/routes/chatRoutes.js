import express from "express";
import { chatHandler } from "../controllers/chatController.js";

const router = express.Router();

// Mounted at app.use("/chat", router) => effective path: POST /chat
router.post("/", chatHandler);

export default router;
