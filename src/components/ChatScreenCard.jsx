export default function ChatScreenCard({ message }) {
  return (
    <div className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] p-5 rounded-2xl shadow-lg ${
          message.isUser
            ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white ml-12 rounded-br-md"
            : "bg-black/30 backdrop-blur-md text-gray-100 mr-12 border border-white/10 rounded-bl-md"
        }`}
      >
        <p className="text-sm leading-relaxed">{message.content}</p>
        <p
          className={`text-xs mt-3 opacity-70 ${
            message.isUser ? "text-white" : "text-gray-300"
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
