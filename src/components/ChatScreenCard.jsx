export default function ChatScreenCard({ message }) {
  return (
    <div className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] p-4 rounded-2xl ${
          message.isUser
            ? "bg-violet-500 text-white ml-12"
            : "bg-white/10 backdrop-blur-sm text-gray-200 mr-12 border border-white/10"
        }`}
      >
        <p className="text-sm leading-relaxed">{message.content}</p>
        <p
          className={`text-xs mt-2 ${
            message.isUser ? "text-white/70" : "text-gray-400"
          }`}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
