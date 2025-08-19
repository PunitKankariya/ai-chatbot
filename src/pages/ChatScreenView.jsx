import ChatScreenHeader from "../components/ChatScreenHeader";
import ChatScreenContainer from "../components/ChatScreenContainer";

export default function ChatPage() {
  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-gradient-to-br from-[#1a1c2c] via-[#2d1f4a] to-[#3e206d] rounded-xl shadow-lg">
      {/* Subtle animated overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-purple-900/20 pointer-events-none"></div>

      {/* Floating shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-400/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Chat UI */}
      <ChatScreenHeader />
      <div className="flex-1 overflow-hidden">
        <ChatScreenContainer />
      </div>
    </div>
  );
}
