import { useState } from "react";

export default function App() {
  const [messages, setMessages] = useState([
    { text: "Hello! Ask me something...", sender: "bot" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { text: input, sender: "user" }]);

    // Simulated bot reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: "This is a test reply from the bot.", sender: "bot" },
      ]);
    }, 800);

    setInput("");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 text-lg font-semibold">
        📚 College Notes Chatbot
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg max-w-xs ${
              msg.sender === "user"
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-300 text-gray-800 self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </main>

      <footer className="p-4 bg-white border-t flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded-lg px-3 py-2 outline-none"
          placeholder="Type your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Send
        </button>
      </footer>
    </div>
  );
}
