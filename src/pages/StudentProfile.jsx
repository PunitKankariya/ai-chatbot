import React, { useRef, useState } from "react";
import AppLayout from "../components/ui/AppLayout";
import { ArrowLeft, MessageCircle, BookOpen, Award, Brain } from "lucide-react";
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

  // Category helpers removed since category badge is hidden

  const [profile, setProfile] = useState(studentData);
  const [draft, setDraft] = useState(studentData);
  const [isEditing, setIsEditing] = useState(false);
  const imageInputRef = useRef(null);

  const startEditing = () => {
    setDraft(profile);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setDraft(profile);
    setIsEditing(false);
  };

  const saveEditing = () => {
    setProfile(draft);
    setIsEditing(false);
  };

  const handleDraftChange = (key, value) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const handleFocusAreasChange = (value) => {
    const items = value
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    setDraft((prev) => ({ ...prev, focusAreas: items }));
  };

  const handleImageSelected = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setDraft((prev) => ({ ...prev, profileImage: url }));
    e.target.value = "";
  };

  // Category text color helper removed

  return (
    <AppLayout>
      <div className="h-full bg-gradient-to-b from-slate-900 to-purple-900 text-white">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <Link
            to="/chat"
            className="flex items-center space-x-2 text-white hover:text-purple-300"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </Link>
          <h1 className="text-lg font-semibold">Student Profile</h1>
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm"
            >
              Log in
            </Link>
            {isEditing ? (
              <>
                <button
                  onClick={saveEditing}
                  className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm"
                >
                  Save
                </button>
                <button
                  onClick={cancelEditing}
                  className="px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={startEditing}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm"
              >
                Edit
              </button>
            )}
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex flex-col items-center mt-6">
          <div className="relative">
            <img
              src={isEditing ? draft.profileImage : profile.profileImage}
              alt={isEditing ? draft.name : profile.name}
              className="w-28 h-28 rounded-full border-4 border-purple-400 shadow-lg object-cover"
            />
            {isEditing && (
              <button
                onClick={() => imageInputRef.current?.click()}
                className="absolute -bottom-2 right-0 px-2 py-1 text-xs rounded-md bg-white/20 hover:bg-white/30"
              >
                Change
              </button>
            )}
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelected}
            />
          </div>

          {isEditing ? (
            <div className="mt-4 w-full max-w-md space-y-3 px-6">
              <input
                value={draft.name}
                onChange={(e) => handleDraftChange("name", e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/60"
                placeholder="Full name"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  value={draft.year}
                  onChange={(e) => handleDraftChange("year", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/60"
                  placeholder="Year"
                />
                <input
                  value={draft.department}
                  onChange={(e) =>
                    handleDraftChange("department", e.target.value)
                  }
                  className="w-full px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/60"
                  placeholder="Department"
                />
              </div>
              {/* Category selection removed */}
            </div>
          ) : (
            <>
              <h2 className="mt-4 text-2xl font-bold">{profile.name}</h2>
              <p className="text-purple-300">
                {profile.year} • {profile.department}
              </p>
              {/* Category badge removed */}
            </>
          )}
        </div>

        {/* Study Completion */}
        <div className="mt-8 px-6">
          <p className="mb-2 font-medium">Study Completion</p>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div
              className="h-3 rounded-full bg-purple-500"
              style={{
                width: `${
                  isEditing ? draft.studyCompletion : profile.studyCompletion
                }%`,
              }}
            ></div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm">
              {isEditing ? draft.studyCompletion : profile.studyCompletion}%
            </p>
            {isEditing && (
              <input
                type="range"
                min="0"
                max="100"
                value={draft.studyCompletion}
                onChange={(e) =>
                  handleDraftChange("studyCompletion", Number(e.target.value))
                }
              />
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8 px-6">
          <div className="bg-purple-800/40 p-4 rounded-xl flex flex-col items-center">
            <BookOpen className="w-6 h-6 text-purple-300" />
            <p className="mt-2 text-lg font-bold">
              {profile.stats.notesAccessed}
            </p>
            <p className="text-sm text-purple-300">Notes</p>
          </div>
          <div className="bg-purple-800/40 p-4 rounded-xl flex flex-col items-center">
            <MessageCircle className="w-6 h-6 text-purple-300" />
            <p className="mt-2 text-lg font-bold">
              {profile.stats.questionsAsked}
            </p>
            <p className="text-sm text-purple-300">Questions</p>
          </div>
          <div className="bg-purple-800/40 p-4 rounded-xl flex flex-col items-center">
            <Award className="w-6 h-6 text-purple-300" />
            <p className="mt-2 text-lg font-bold">
              {profile.stats.quizzesAttempted}
            </p>
            <p className="text-sm text-purple-300">Quizzes</p>
          </div>
        </div>

        {/* Focus Areas */}
        <div className="mt-8 px-6">
          <h3 className="text-lg font-semibold mb-3">Focus Areas</h3>
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={draft.focusAreas.join(", ")}
                onChange={(e) => handleFocusAreasChange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/60"
                rows={3}
                placeholder="Comma-separated list, e.g., DSA, ML Fundamentals"
              />
              <p className="text-xs text-white/60">
                Separate items with commas.
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {profile.focusAreas.map((area, idx) => (
                <li
                  key={idx}
                  className="flex items-center bg-purple-800/40 px-4 py-2 rounded-lg"
                >
                  <Brain className="w-5 h-5 text-purple-300 mr-3" />
                  {area}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Bottom navigation removed for cleaner profile view */}
      </div>
    </AppLayout>
  );
}
