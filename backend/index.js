// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import chatRoutes from "./routes/chatRoutes.js";
// import { errorHandler } from "./middleware/errorHandler.js";
// app.use(errorHandler);

// dotenv.config();
// const app = express();

// app.use(cors());
// app.use(express.json());

// // API Routes
// app.use("/chat", chatRoutes);

// // Default health check
// app.get("/", (req, res) => {
//   res.send("✅ Chatbot backend is running!");
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRoutes from "./routes/chatRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use("/chat", chatRoutes);

// Default health check route
app.get("/", (req, res) => {
  res.send("✅ Chatbot backend is running!");
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
