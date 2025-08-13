export default function ChatScreenCard({ message }) {
  return (
    <div className={`flex ${message.isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[75%] p-4 rounded-2xl ${
          message.isUser
            ? "bg-white/10 backdrop-blur-sm text-white ml-12 border border-white/20"
            : "bg-white/10 backdrop-blur-sm text-white mr-12 border border-white/20"
        }`}
      >
        <p className="text-sm leading-relaxed text-white/90">{message.content}</p>
        <p className="text-xs mt-2 text-white/60">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
