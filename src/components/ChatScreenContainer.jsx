import { Send, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import ChatScreenCard from "./ChatScreenCard";

const modes = [
  { value: "eli5", label: "ELI5" },
  { value: "exam", label: "Exam Prep" },
  { value: "detailed", label: "Detailed" },
];

export default function ChatScreenContainer() {
  const [messages, setMessages] = useState([
    {
      id: "1",
      content:
        "Hi! I'm StudyMate AI, your personal study assistant. I can help explain concepts, prepare for exams, or dive deep into any topic from your syllabus. What would you like to learn about today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [selectedMode, setSelectedMode] = useState("detailed");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");

    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        content: `I understand you're asking about "${inputValue}". Let me help you with that in ${
          modes.find((m) => m.value === selectedMode)?.label
        } mode.`,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="relative z-10 flex flex-col flex-1">
      <div className="relative z-10 flex-1 overflow-y-auto p-4 space-y-4 h-[calc(100vh-140px)]">
        {messages.map((message) => (
          <ChatScreenCard key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="relative z-10 p-4 bg-black/20 backdrop-blur-sm border-t border-white/10">
        <div className="flex items-center gap-3">
          {/* Mode Selector */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 text-white/80 text-sm hover:bg-white/15 transition-colors"
            >
              {modes.find((m) => m.value === selectedMode)?.label}
              <ChevronDown className="w-4 h-4" />
            </button>

            {isDropdownOpen && (
              <div className="absolute bottom-full mb-2 left-0 bg-black/80 backdrop-blur-sm rounded-lg border border-white/20 overflow-hidden">
                {modes.map((mode) => (
                  <button
                    key={mode.value}
                    onClick={() => {
                      setSelectedMode(mode.value);
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full px-4 py-2 text-left text-white/80 hover:bg-white/10 transition-colors text-sm"
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input Field */}
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask anything from your syllabus..."
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
            />
          </div>

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="p-3 bg-cyan-400 hover:bg-cyan-300 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-xl transition-colors shadow-lg shadow-cyan-400/25"
          >
            <Send className="w-5 h-5 text-black" />
          </button>
        </div>
      </div>
    </div>
  );
}
