import ChatScreenHeader from "../components/chatScreenHeader";
import ChatScreenContainer from "../components/ChatScreenContainer";

export default function ChatScreenView() {
  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-gradient-to-br from-[#2d1b69] via-[#4c1d95] to-[#7c3aed]">
      {/* Subtle animated overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-purple-900/20 pointer-events-none"></div>
      
      {/* Very subtle floating shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-400/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <ChatScreenHeader />
      <div className="flex-1 overflow-hidden">
        <ChatScreenContainer />
      </div>
    </div>
  );
}
