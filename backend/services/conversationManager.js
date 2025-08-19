// backend/conversationManager.js
export const handleChat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Example AI logic: just echo back
    res.json({ reply: `You said: ${message}` });
  } catch (error) {
    console.error("Error in handleChat:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


