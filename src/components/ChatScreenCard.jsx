export default function ChatScreenCard({ message }) {
  return (
    <div className={`flex ${message.isUser ? "justify-end" : "justify-start"} mb-6`}>
      <div
        className={`max-w-[80%] p-4 rounded-2xl ${
          message.isUser
            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white ml-auto"
            : "bg-black/10 backdrop-blur-sm text-white mr-auto"
        }`}
      >
        <p className="text-sm leading-relaxed">{message.content}</p>
        <p className="text-xs mt-2 opacity-60">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
