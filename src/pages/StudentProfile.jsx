import React, { useEffect, useRef, useState } from "react";
import AppLayout from "../components/ui/AppLayout";
import { ArrowLeft, MessageCircle, BookOpen, Award, Brain } from "lucide-react";
import { Link } from "react-router-dom";

export default function StudentProfile() {
  const defaultStudentData = {
    name: "Sarah Johnson",
    year: "3rd Year",
    department: "Computer Science",
    category: "Topper",
    profileImage: "/placeholder.svg",
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

  const [profile, setProfile] = useState(defaultStudentData);
  const [draft, setDraft] = useState(defaultStudentData);
  const [isEditing, setIsEditing] = useState(false);
  const imageInputRef = useRef(null);

  // Load saved profile from localStorage on mount
  useEffect(() => {
    try {
      // First try to get from userProfile (from simplified signup)
      const userProfile = localStorage.getItem("userProfile");
      if (userProfile) {
        const parsed = JSON.parse(userProfile);
        const adaptedProfile = {
          name: parsed.fullName || defaultStudentData.name,
          email: parsed.email,
          phone: parsed.phone,
          registrationDate: parsed.registrationDate,
          profileImage: defaultStudentData.profileImage,
          year: defaultStudentData.year,
          department: defaultStudentData.department,
          stats: defaultStudentData.stats,
          focusAreas: defaultStudentData.focusAreas,
          category: defaultStudentData.category
        };
        setProfile(adaptedProfile);
        setDraft(adaptedProfile);
        return;
      }
      
      // Fallback to studentProfile (legacy)
      const studentProfile = localStorage.getItem("studentProfile");
      if (studentProfile) {
        const parsed = JSON.parse(studentProfile);
        const adaptedProfile = {
          name: parsed.fullName || defaultStudentData.name,
          year: parsed.currentYear || defaultStudentData.year,
          department: parsed.department || defaultStudentData.department,
          degree: parsed.degree,
          branch: parsed.branch,
          specialization: parsed.specialization,
          studentId: parsed.studentId,
          email: parsed.email,
          phone: parsed.phone,
          address: parsed.address,
          dateOfBirth: parsed.dateOfBirth,
          guardianName: parsed.guardianName,
          guardianPhone: parsed.guardianPhone,
          previousYearMarks: parsed.previousYearMarks,
          twelfthMarks: parsed.twelfthMarks,
          currentSemester: parsed.currentSemester,
          progressPrediction: parsed.progressPrediction,
          registrationDate: parsed.registrationDate,
          profileImage: parsed.profileImage || defaultStudentData.profileImage,
          stats: defaultStudentData.stats,
          focusAreas: defaultStudentData.focusAreas,
          category: defaultStudentData.category
        };
        setProfile(adaptedProfile);
        setDraft(adaptedProfile);
        return;
      }
      
      // Fallback to user_profile
      const saved = localStorage.getItem("user_profile");
      if (saved) {
        const parsed = JSON.parse(saved);
        setProfile(parsed);
        setDraft(parsed);
      }
    } catch (_) {
      // ignore parse errors
    }
  }, []);

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
    try {
      localStorage.setItem("user_profile", JSON.stringify(draft));
    } catch (_) {
      // ignore
    }
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
            <div className="p-1 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-amber-400">
              <div className="rounded-full bg-slate-900 p-1">
                {(isEditing ? draft.profileImage : profile.profileImage) ? (
                  <img
                    src={isEditing ? draft.profileImage : profile.profileImage}
                    alt={isEditing ? draft.name : profile.name}
                    className="w-28 h-28 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-white/10 flex items-center justify-center text-3xl font-semibold">
                    {(isEditing ? draft.name : profile.name)
                      .split(" ")
                      .map((p) => p[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="absolute -bottom-3 right-0 flex gap-2">
                <button
                  onClick={() => imageInputRef.current?.click()}
                  className="px-2 py-1 text-xs rounded-md bg-white/20 hover:bg-white/30"
                >
                  Change
                </button>
                <button
                  onClick={() => setDraft((p) => ({ ...p, profileImage: "" }))}
                  className="px-2 py-1 text-xs rounded-md bg-red-500/80 hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
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


        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8 px-6">
          {[
            { icon: BookOpen, label: "Notes", key: "notesAccessed" },
            { icon: MessageCircle, label: "Questions", key: "questionsAsked" },
            { icon: Award, label: "Quizzes", key: "quizzesAttempted" },
          ].map(({ icon: Icon, label, key }) => (
            <div
              key={key}
              className="bg-purple-800/40 p-4 rounded-xl flex flex-col items-center"
            >
              <Icon className="w-6 h-6 text-purple-300" />
              {isEditing ? (
                <input
                  type="number"
                  min="0"
                  value={draft.stats[key]}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      stats: {
                        ...prev.stats,
                        [key]: Number(e.target.value) || 0,
                      },
                    }))
                  }
                  className="mt-2 text-lg font-bold text-center w-24 rounded bg-white/10"
                />
              ) : (
                <p className="mt-2 text-lg font-bold">{profile.stats[key]}</p>
              )}
              <p className="text-sm text-purple-300">{label}</p>
            </div>
          ))}
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
