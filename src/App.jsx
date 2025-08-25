// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import NotesPage from "./pages/NotesPage";
import QuizzesPage from "./pages/QuizzesPage";
import ProgressPage from "./pages/ProgressPage.jsx";
import SettingsPage from "./pages/SettingsPage";
import StudentProfile from "./pages/StudentProfile.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import StudentProgressTracker from "./pages/StudentProgressTracker.jsx";

function App() {
  return (
    <Router>
      <div className="w-full h-screen overflow-hidden">
        <Routes>
          {/* Redirect root to /chat */}
          <Route path="/" element={<Navigate to="/chat" replace />} />

          {/* Pages */}
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/quizzes" element={<QuizzesPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<StudentProfile />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/progress-tracker" element={<StudentProgressTracker />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
