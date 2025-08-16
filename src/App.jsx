import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatScreenView from "./pages/ChatScreenView";   // ✅ fixed
import StudentProfile from "./pages/StudentProfile";   // ✅ fixed

function App() {
  return (
    <Router>
      <div className="w-full h-screen overflow-hidden">
        <Routes>
          <Route path="/" element={<ChatScreenView />} />
          <Route path="/profile" element={<StudentProfile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
