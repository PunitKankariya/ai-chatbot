import { useState } from "react";
import { sendMessage } from "../lib/api";

function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const res = await sendMessage(input);

    setMessages([...messages, { user: input, bot: res.reply }]);
    setInput("");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">AI Chatbot</h1>

      <div className="border p-3 mb-3 h-64 overflow-y-auto">
        {messages.map((m, i) => (
          <div key={i} className="mb-2">
            <p><b>You:</b> {m.user}</p>
            <p><b>Bot:</b> {m.bot}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="border px-2 py-1 flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatPage;
