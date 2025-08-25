import { User, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

export default function ChatScreenHeader() {
  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between px-6 py-4"
      style={{
        background:
          "linear-gradient(135deg, rgba(45, 27, 105, 0.95) 0%, rgba(76, 29, 149, 0.95) 50%, rgba(124, 58, 237, 0.95) 100%)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="bg-black/20 backdrop-blur-sm rounded-xl px-4 py-2">
        <h1 className="text-xl font-semibold text-white">StudyMate AI</h1>
      </div>
      <div className="flex items-center gap-3 pr-4">
        <Link
          to="/login"
          className="w-10 h-10 bg-black/20 backdrop-blur-sm hover:bg-black/30 rounded-xl flex items-center justify-center transition-all duration-200"
        >
          <LogIn className="w-5 h-5 text-white/80" />
        </Link>
        <Link
          to="/profile"
          className="w-10 h-10 bg-black/20 backdrop-blur-sm hover:bg-black/30 rounded-xl flex items-center justify-center transition-all duration-200"
        >
          <User className="w-5 h-5 text-white/80" />
        </Link>
      </div>
    </header>
  );
}
