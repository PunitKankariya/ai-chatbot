// // // src/App.jsx
// // import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// // import ChatPage from "./pages/ChatPage";
// // import NotesPage from "./pages/NotesPage";
// // import QuizzesPage from "./pages/QuizzesPage";
// // import ProgressPage from "./pages/ProgressPage.jsx";
// // import SettingsPage from "./pages/SettingsPage";
// // import StudentProfile from "./pages/StudentProfile.jsx";

// // function App() {
// //   return (
// //     <Router>
// //       <div className="w-full h-screen overflow-hidden">
// //         <Routes>
// //           {/* Redirect root to /chat */}
// //           <Route path="/" element={<Navigate to="/chat" replace />} />

// //           {/* Pages */}
// //           <Route path="/chat" element={<ChatPage />} />
// //           <Route path="/notes" element={<NotesPage />} />
// //           <Route path="/quizzes" element={<QuizzesPage />} />
// //           <Route path="/progress" element={<ProgressPage />} />
// //           <Route path="/settings" element={<SettingsPage />} />
// //             <Route path="/profile" element={<StudentProfile />} />
// //         </Routes>
// //       </div>
// //     </Router>
// //   );
// // }

// // export default App;
// import { useState } from "react";
// import "./App.css";

// function App() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");

//   const sendMessage = async () => {
//     if (!input) return;

//     // Add user message
//     const newMessages = [...messages, { sender: "user", text: input }];
//     setMessages(newMessages);

//     try {
//       const res = await fetch("http://localhost:5000/ask", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ question: input })
//       });
//       const data = await res.json();

//       setMessages([...newMessages, { sender: "bot", text: data.answer }]);
//     } catch (err) {
//       setMessages([...newMessages, { sender: "bot", text: "⚠️ Backend error" }]);
//     }

//     setInput("");
//   };

//   return (
//     <div className="chat-container">
//       <h2>AI Chatbot</h2>
//       <div className="messages">
//         {messages.map((m, i) => (
//           <div key={i} className={m.sender}>
//             <b>{m.sender === "user" ? "You" : "Bot"}:</b> {m.text}
//           </div>
//         ))}
//       </div>
//       <div className="input-area">
//         <input
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Type a message..."
//         />
//         <button onClick={sendMessage}>Send</button>
//       </div>
//     </div>
//   );
// }

// export default App;
import { useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input) return;

    // Add user message
    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);

    try {
      const res = await fetch("http://localhost:5000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input })
      });
      const data = await res.json();

      setMessages([...newMessages, { sender: "bot", text: data.answer }]);
    } catch (err) {
      setMessages([...newMessages, { sender: "bot", text: "⚠️ Backend error" }]);
    }

    setInput("");
  };

  return (
    <div className="chat-container">
      <h2>AI Chatbot</h2>
      <div className="messages">
        {messages.map((m, i) => (
          <div key={i} className={m.sender}>
            <b>{m.sender === "user" ? "You" : "Bot"}:</b> {m.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
