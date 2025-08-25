import { Send, ChevronDown, FileUp } from "lucide-react";
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
  const pdfInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const currentInput = inputValue;

    // Add user message immediately
    const userMessage = {
      id: Date.now().toString(),
      content: currentInput,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Add loading placeholder
    const loadingMessage = {
      id: "loading",
      content: "Thinking...",
      isUser: false,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, loadingMessage]);

    try {
      // Prepare history for backend
      const history = messages.map((m) => ({
        role: m.isUser ? "user" : "assistant",
        content: m.content,
      }));

      const res = await fetch("http://localhost:5001/chat/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentInput, history }),
      });

      if (!res.ok) throw new Error(`Backend error: ${res.status}`);
      const data = await res.json();

      // Replace loading with AI reply
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== "loading"),
        {
          id: (Date.now() + 1).toString(),
          content: data.reply || "(No reply)",
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      console.error("Chat API Error:", err);
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== "loading"),
        {
          id: (Date.now() + 2).toString(),
          content: "Sorry, the server failed to respond. Please try again.",
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handlePdfSelected = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        content: `Uploaded PDF: ${file.name}`,
        isUser: true,
        timestamp: new Date(),
      },
    ]);
    e.target.value = "";
  };



  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <ChatScreenCard key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="relative z-20 px-6 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
            {/* Mode Selector */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-transparent text-white text-sm hover:bg-white/5 transition-all duration-200 rounded-lg"
              >
                {modes.find((m) => m.value === selectedMode)?.label}
                <ChevronDown className="w-4 h-4" />
              </button>

              {isDropdownOpen && (
                <div className="absolute bottom-full mb-2 left-0 bg-black/80 backdrop-blur-xl rounded-xl overflow-hidden shadow-2xl min-w-[120px]">
                  {modes.map((mode) => (
                    <button
                      key={mode.value}
                      onClick={() => {
                        setSelectedMode(mode.value);
                        setIsDropdownOpen(false);
                      }}
                      className={`block w-full px-4 py-2.5 text-left text-sm transition-colors ${
                        selectedMode === mode.value
                          ? "bg-white/20 text-white"
                          : "text-white/80 hover:bg-white/10"
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* PDF Upload Button */}
            <div className="flex items-center gap-2">
              <input
                ref={pdfInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handlePdfSelected}
              />
              <button
                type="button"
                onClick={() => pdfInputRef.current?.click()}
                title="Upload PDF"
                aria-label="Upload PDF"
                className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200 hover:scale-105"
              >
                <FileUp className="w-4 h-4 text-white" />
              </button>
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
                className="w-full px-4 py-2 bg-transparent text-white placeholder-white/60 focus:outline-none text-sm border-none"
              />
            </div>

            {/* Send Button */}
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="p-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600/50 disabled:cursor-not-allowed rounded-full transition-all duration-200 hover:scale-105 group"
            >
              <Send className="w-4 h-4 text-white group-disabled:text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
