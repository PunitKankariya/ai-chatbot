import ChatScreenHeader from "../components/chatScreenHeader";
import ChatScreenContainer from "../components/ChatScreenContainer";

export default function ChatScreenView() {
  return (
    <div className="h-screen w-full relative overflow-hidden" style={{background: 'linear-gradient(135deg, #2d1b69 0%, #673ab7 50%, #9c27b0 100%)'}}>
      {/* Animated Background Gradient Overlay */}
      <div className="absolute inset-0" style={{background: 'linear-gradient(45deg, rgba(103, 58, 183, 0.4) 0%, rgba(156, 39, 176, 0.3) 50%, rgba(139, 69, 187, 0.2) 100%)'}}></div>
      
      {/* Floating Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-violet-400/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-1/3 w-56 h-56 bg-purple-400/5 rounded-full blur-2xl animate-pulse delay-500"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-fuchsia-500/3 rounded-full blur-3xl animate-pulse delay-3000"></div>
      </div>

      <ChatScreenHeader />
      <ChatScreenContainer />
    </div>
  );
}
