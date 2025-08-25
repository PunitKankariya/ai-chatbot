import { Link, useLocation } from "react-router-dom";

export default function AppLayout({ children }) {
  const location = useLocation();

  // Sidebar menu items
  const menuItems = [
    { name: "Chat", path: "/chat", icon: "💬" },
    { name: "Notes", path: "/notes", icon: "📒" },
    { name: "Quizzes", path: "/quizzes", icon: "📝" },
    { name: "Progress", path: "/progress", icon: "📊" },
    { name: "Settings", path: "/settings", icon: "⚙️" },
    { name: "Profile", path: "/profile", icon: "👤" },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-950 text-white">
      {/* Sidebar */}
      <aside className="w-60 bg-purple-950 p-5 flex flex-col">
        <h1 className="text-2xl font-bold mb-8">StudyMate AI</h1>

        <nav className="flex flex-col gap-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition 
                 ${
                   location.pathname === item.path
                     ? "bg-purple-700 text-white"
                     : "text-gray-300 hover:bg-purple-800"
                 }`}
            >
              <span>{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>

      </aside>

      {/* Main Content */}
      <main className="flex-1 relative">
        <div className="p-6 overflow-y-auto h-full">{children}</div>
      </main>
    </div>
  );
}
