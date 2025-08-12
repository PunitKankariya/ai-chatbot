import { User } from "lucide-react";

export default function ChatScreenHeader() {
  return (
    <div className="relative z-10 flex items-center justify-between p-4 bg-black/20 backdrop-blur-sm border-b border-white/10">
      <h1 className="text-xl font-bold text-white font-sans">StudyMate AI</h1>
      <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
        <User className="w-5 h-5 text-white/80" />
      </div>
    </div>
  );
}
