console.log("[1/5] Server script started.");

import "./config/env.js"; 
console.log("[2/5] Environment variables loaded.");

import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chatRoutes.js";
console.log("[3/5] Dependencies imported.");

const app = express();
console.log("[4/5] Express app initialized.");
const PORT = process.env.PORT || 5050;

// Handle server errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Middleware
app.use(cors());          // ✅ Fix CORS issues for frontend
app.use(express.json());

// Routes
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please try a different port.`);
  } else {
    console.error('Server error:', error);
  }
  process.exit(1);
});
