import React from "react";
import {
  ArrowLeft,
  Home,
  MessageCircle,
  BookOpen,
  User,
  Award,
  Clock,
  HelpCircle,
  Brain,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function StudentProfile() {
  const studentData = {
    name: "Sarah Johnson",
    year: "3rd Year",
    department: "Computer Science",
    category: "Topper",
    profileImage: "/placeholder.svg",
    studyCompletion: 85,
    stats: {
      notesAccessed: 247,
      questionsAsked: 89,
      quizzesAttempted: 34,
    },
    focusAreas: [
      "Data Structures & Algorithms",
      "Machine Learning Fundamentals",
      "Database Management Systems",
    ],
  };

  // ✅ helpers (must be above return)
  const getCategoryColor = (category) => {
    switch (category) {
      case "Low":
        return "bg-red-500";
      case "Medium":
        return "bg-yellow-500";
      case "Topper":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getCategoryTextColor = (category) => {
    switch (category) {
      case "Low":
        return "text-red-600";
      case "Medium":
        return "text-yellow-600";
      case "Topper":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-purple-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <Link
          to="/"
          className="flex items-center space-x-2 text-white hover:text-purple-300"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </Link>
        <h1 className="text-lg font-semibold">Student Profile</h1>
        <div className="w-5 h-5" /> {/* spacer */}
      </div>

      {/* Profile Info */}
      <div className="flex flex-col items-center mt-6">
        <img
          src={studentData.profileImage}
          alt={studentData.name}
          className="w-28 h-28 rounded-full border-4 border-purple-400 shadow-lg"
        />
        <h2 className="mt-4 text-2xl font-bold">{studentData.name}</h2>
        <p className="text-purple-300">
          {studentData.year} • {studentData.department}
        </p>
        <span
          className={`mt-2 px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(
            studentData.category
          )} ${getCategoryTextColor(studentData.category)}`}
        >
          {studentData.category}
        </span>
      </div>

      {/* Study Completion */}
      <div className="mt-8 px-6">
        <p className="mb-2 font-medium">Study Completion</p>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div
            className="h-3 rounded-full bg-purple-500"
            style={{ width: `${studentData.studyCompletion}%` }}
          ></div>
        </div>
        <p className="text-right text-sm mt-1">
          {studentData.studyCompletion}%
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-8 px-6">
        <div className="bg-purple-800/40 p-4 rounded-xl flex flex-col items-center">
          <BookOpen className="w-6 h-6 text-purple-300" />
          <p className="mt-2 text-lg font-bold">
            {studentData.stats.notesAccessed}
          </p>
          <p className="text-sm text-purple-300">Notes</p>
        </div>
        <div className="bg-purple-800/40 p-4 rounded-xl flex flex-col items-center">
          <MessageCircle className="w-6 h-6 text-purple-300" />
          <p className="mt-2 text-lg font-bold">
            {studentData.stats.questionsAsked}
          </p>
          <p className="text-sm text-purple-300">Questions</p>
        </div>
        <div className="bg-purple-800/40 p-4 rounded-xl flex flex-col items-center">
          <Award className="w-6 h-6 text-purple-300" />
          <p className="mt-2 text-lg font-bold">
            {studentData.stats.quizzesAttempted}
          </p>
          <p className="text-sm text-purple-300">Quizzes</p>
        </div>
      </div>

      {/* Focus Areas */}
      <div className="mt-8 px-6">
        <h3 className="text-lg font-semibold mb-3">Focus Areas</h3>
        <ul className="space-y-2">
          {studentData.focusAreas.map((area, idx) => (
            <li
              key={idx}
              className="flex items-center bg-purple-800/40 px-4 py-2 rounded-lg"
            >
              <Brain className="w-5 h-5 text-purple-300 mr-3" />
              {area}
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-800/90 backdrop-blur-md flex justify-around py-3 border-t border-purple-700/40">
        <Link to="/" className="flex flex-col items-center text-purple-300">
          <Home className="w-6 h-6" />
          <span className="text-xs">Home</span>
        </Link>
        <Link to="/" className="flex flex-col items-center text-purple-300">
          <MessageCircle className="w-6 h-6" />
          <span className="text-xs">Chat</span>
        </Link>
        <Link to="/profile" className="flex flex-col items-center text-purple-300">
          <User className="w-6 h-6" />
          <span className="text-xs">Profile</span>
        </Link>
        <button className="flex flex-col items-center text-purple-300">
          <Clock className="w-6 h-6" />
          <span className="text-xs">History</span>
        </button>
        <button className="flex flex-col items-center text-purple-300">
          <HelpCircle className="w-6 h-6" />
          <span className="text-xs">Help</span>
        </button>
      </div>
    </div>
  );
}
