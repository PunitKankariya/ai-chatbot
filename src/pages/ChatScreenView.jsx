import ChatScreenHeader from "../components/chatScreenHeader";
import ChatScreenContainer from "../components/ChatScreenContainer";
import "../styles/ChatScreen.css";

export default function ChatScreenView() {
  return (
    <div className="h-screen w-full relative overflow-hidden bg-gradient-to-b from-slate-900 to-purple-900">
      {/* Floating Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-violet-400/10 rounded-full blur-lg animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-purple-400/10 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      <ChatScreenHeader />
      <ChatScreenContainer />
    </div>
  );
}
