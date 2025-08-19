import { useState } from "react";

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Send message to backend
  const sendMessage = async (message) => {
    try {
      setLoading(true);
      setError(null);

      // Add user message to chat history
      const newUserMessage = { role: "user", content: message };
      setMessages((prev) => [...prev, newUserMessage]);

      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          history: messages, // pass previous messages as context
        }),
      });

      const data = await response.json();

      if (data.error) throw new Error(data.error);

      // Add AI reply
      const newAIMessage = { role: "ai", content: data.reply };
      setMessages((prev) => [...prev, newAIMessage]);

    } catch (err) {
      console.error("Chat Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { messages, loading, error, sendMessage };
}
