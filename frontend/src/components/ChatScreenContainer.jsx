import { useState, useRef, useEffect } from "react";
import { useChat } from "../hooks/useChat";

export default function ChatScreenContainer() {
  const { messages, loading, error, sendMessage } = useChat();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-[70%] text-sm shadow-md ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-900 rounded-bl-none"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <p className="text-gray-400 text-sm italic">AI is typing...</p>
        )}
        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="flex items-center border-t border-white/10 bg-black/20 backdrop-blur-md p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-white/10 text-white border border-white/20 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-300"
        />
        <button
          type="submit"
          disabled={loading}
          className="ml-2 bg-blue-500 text-white px-5 py-2 rounded-full hover:bg-blue-600 transition disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
