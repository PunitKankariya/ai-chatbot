import { User } from "lucide-react";

export default function ChatScreenHeader() {
  return (
    <div className="relative z-10 flex items-center justify-between px-6 py-4 bg-black/10 backdrop-blur-md border-b border-white/10">
      <h1 className="text-xl font-bold text-white font-sans tracking-wide">StudyMate AI</h1>
      <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors cursor-pointer">
        <User className="w-5 h-5 text-white/80" />
      </div>
    </div>
  );
}
