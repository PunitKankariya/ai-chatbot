import { useState } from "react";
import { useChat } from "../hooks/useChat";

export default function ChatScreenContainer() {
  const { messages, loading, error, sendMessage } = useChat();
  const [input, setInput] = useState("");

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    await sendMessage(input);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-[70%] text-sm ${
                msg.role === "user"
                  ? "bg-purple-600 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-900 rounded-bl-none"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-gray-400 text-sm italic">Thinking...</div>
        )}

        {error && (
          <div className="text-red-500 text-sm">⚠️ {error}</div>
        )}
      </div>

      {/* Input area */}
      <form
        onSubmit={handleSend}
        className="p-3 border-t border-gray-700 bg-[#1f1f2e]"
      >
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 rounded-full bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-full bg-purple-600 text-white font-medium hover:bg-purple-700 transition"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
