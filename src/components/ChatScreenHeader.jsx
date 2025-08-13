export default function ChatScreenHeader() {
  return (
    <div 
      className="relative z-50 flex items-center justify-between px-6 py-5 border-b border-white/10" 
      style={{backgroundColor: '#16213e', boxShadow: '0 2px 10px rgba(0,0,0,0.3)'}}
    >
      <h1 className="text-2xl font-bold text-white drop-shadow-lg">
        StudyMate AI
      </h1>
      <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-500 transition-all duration-200 cursor-pointer shadow-xl border-2 border-gray-500">
        <span className="text-white font-bold text-lg">A</span>
      </div>
    </div>
  );
}
