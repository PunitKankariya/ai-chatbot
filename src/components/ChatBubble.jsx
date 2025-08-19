// components/ChatBubble.jsx
export default function ChatBubble({ text, sender, time }) {
    const isUser = sender === "user";
  
    return (
      <div
        className={`flex w-full mb-3 ${isUser ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow-md
            ${isUser
              ? "bg-blue-500 text-white rounded-br-none"
              : "bg-purple-500/30 text-white rounded-bl-none"
            }`}
        >
          <p>{text}</p>
          <span className="text-xs opacity-60 block mt-1">
            {time}
          </span>
        </div>
      </div>
    );
  }
  