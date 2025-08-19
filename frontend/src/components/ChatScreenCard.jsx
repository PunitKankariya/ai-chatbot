import React from "react";

export default function ChatScreenCard({ message }) {
  const isUser = message.isUser;

  return (
    <div
      className={`flex items-end gap-3 ${
        isUser ? "justify-end" : "justify-start"
      } mb-6`}
    >
      {/* AI Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-xs text-white font-bold shadow-md">
          AI
        </div>
      )}

      {/* Chat Bubble */}
      <div
        className={`max-w-[75%] p-4 rounded-2xl shadow-md animate-fadeInUp ${
          isUser
            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-none"
            : "bg-white/10 backdrop-blur-sm text-white rounded-bl-none"
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

      {/* User Avatar */}
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs text-white font-bold shadow-md">
          U
        </div>
      )}
    </div>
  );
}
