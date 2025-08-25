import React, { useState, useEffect } from "react";
import AppLayout from "../components/ui/AppLayout";
import { ArrowLeft, User, GraduationCap, TrendingUp, Target, Award, BookOpen, Brain, ChevronRight, Plus, Edit3, Save, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function StudentProgressTracker() {
  const [studentData, setStudentData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    studentId: "",
    department: "",
    branch: "",
    currentYear: "",
    currentSemester: "",
    previousYearMarks: "",
    email: "",
    phone: ""
  });

  // Progress prediction algorithm
  const calculateProgressPrediction = (data) => {
    let score = 0;
    let factors = [];

    // Previous year marks weight (40%)
    const marksScore = (parseFloat(data.previousYearMarks) / 100) * 40;
    score += marksScore;
    factors.push({
      factor: "Previous Year Performance",
      score: marksScore,
      weight: "40%",
      status: data.previousYearMarks >= 75 ? "Excellent" : data.previousYearMarks >= 60 ? "Good" : "Needs Improvement"
    });

    // Department difficulty factor (20%)
    const deptDifficulty = {
      "Computer Science": 0.9,
      "Information Technology": 0.85,
      "Electronics": 0.8,
      "Mechanical": 0.75,
      "Civil": 0.7,
      "Electrical": 0.75
    };
    const deptScore = (deptDifficulty[data.department] || 0.7) * 20;
    score += deptScore;
    factors.push({
      factor: "Department Complexity",
      score: deptScore,
      weight: "20%",
      status: deptScore >= 16 ? "High Challenge" : deptScore >= 14 ? "Moderate" : "Manageable"
    });

    // Current year factor (20%)
    const yearMultiplier = {
      "1st Year": 0.9,
      "2nd Year": 0.8,
      "3rd Year": 0.7,
      "4th Year": 0.6
    };
    const yearScore = (yearMultiplier[data.currentYear] || 0.7) * 20;
    score += yearScore;
    factors.push({
      factor: "Academic Year Difficulty",
      score: yearScore,
      weight: "20%",
      status: data.currentYear === "1st Year" ? "Foundation Year" : data.currentYear === "4th Year" ? "Final Year Pressure" : "Core Learning Phase"
    });

    // Branch specialization factor (20%)
    const branchComplexity = {
      "Artificial Intelligence": 0.95,
      "Data Science": 0.9,
      "Software Engineering": 0.85,
      "Cybersecurity": 0.8,
      "Web Development": 0.75,
      "Mobile Development": 0.75,
      "General": 0.7
    };
    const branchScore = (branchComplexity[data.branch] || 0.7) * 20;
    score += branchScore;
    factors.push({
      factor: "Specialization Complexity",
      score: branchScore,
      weight: "20%",
      status: branchScore >= 18 ? "Highly Specialized" : branchScore >= 15 ? "Specialized" : "General Track"
    });

    const finalScore = Math.min(Math.max(score, 0), 100);
    
    return {
      overallScore: Math.round(finalScore),
      grade: finalScore >= 85 ? "A+" : finalScore >= 75 ? "A" : finalScore >= 65 ? "B+" : finalScore >= 55 ? "B" : "C",
      prediction: finalScore >= 80 ? "Excellent Progress Expected" : 
                 finalScore >= 65 ? "Good Progress Expected" : 
                 finalScore >= 50 ? "Moderate Progress Expected" : "Needs Additional Support",
      factors: factors,
      recommendations: generateRecommendations(finalScore, data)
    };
  };

  const generateRecommendations = (score, data) => {
    const recommendations = [];
    
    if (score < 60) {
      recommendations.push("Consider joining study groups for better collaboration");
      recommendations.push("Schedule regular meetings with academic advisors");
      recommendations.push("Focus on building strong fundamentals");
    }
    
    if (data.previousYearMarks < 70) {
      recommendations.push("Review and strengthen concepts from previous year");
      recommendations.push("Utilize additional learning resources and tutorials");
    }
    
    if (data.department === "Computer Science" || data.department === "Information Technology") {
      recommendations.push("Practice coding regularly on platforms like LeetCode or HackerRank");
      recommendations.push("Work on personal projects to build portfolio");
    }
    
    if (data.currentYear === "4th Year") {
      recommendations.push("Focus on placement preparation and interview skills");
      recommendations.push("Complete capstone project with industry relevance");
    }
    
    recommendations.push("Maintain consistent study schedule");
    recommendations.push("Participate in extracurricular activities for holistic development");
    
    return recommendations;
  };

  // Load data on component mount
  useEffect(() => {
    const saved = localStorage.getItem("studentProgressData");
    if (saved) {
      const parsed = JSON.parse(saved);
      setStudentData(parsed);
      setFormData(parsed);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    if (!formData.department || !formData.currentYear || !formData.previousYearMarks) {
      alert("Please fill in all required fields");
      return;
    }

    const progressPrediction = calculateProgressPrediction(formData);
    const dataWithPrediction = {
      ...formData,
      progressPrediction,
      lastUpdated: new Date().toISOString()
    };

    setStudentData(dataWithPrediction);
    localStorage.setItem("studentProgressData", JSON.stringify(dataWithPrediction));
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (studentData) {
      setFormData(studentData);
    }
    setIsEditing(false);
  };

  return (
    <AppLayout>
      <div className="h-full bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-900/90 to-indigo-900/90 backdrop-blur-sm border-b border-white/10">
          <div className="flex items-center justify-between p-4">
            <Link
              to="/chat"
              className="flex items-center space-x-2 text-white hover:text-purple-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </Link>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
              Student Progress Tracker
            </h1>
            <div className="flex items-center gap-2">
              {!studentData ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-medium transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add Student Data
                </button>
              ) : isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Student Data Input/Display */}
          {isEditing || !studentData ? (
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <User className="w-6 h-6 mr-3 text-purple-400" />
                Student Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>
                  <label className="block text-sm font-medium mb-2 text-purple-300">Department *</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electronics">Electronics & Communication</option>
                    <option value="Mechanical">Mechanical Engineering</option>
                    <option value="Civil">Civil Engineering</option>
                    <option value="Electrical">Electrical Engineering</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-purple-300">Specialization</label>
                  <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select Specialization</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Mobile Development">Mobile Development</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-purple-300">Current Year *</label>
                  <select
                    name="currentYear"
                    value={formData.currentYear}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Select Year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-purple-300">Current Semester</label>
                  <select
                    name="currentSemester"
                    value={formData.currentSemester}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select Semester</option>
                    <option value="1">Semester 1</option>
                    <option value="2">Semester 2</option>
                    <option value="3">Semester 3</option>
                    <option value="4">Semester 4</option>
                    <option value="5">Semester 5</option>
                    <option value="6">Semester 6</option>
                    <option value="7">Semester 7</option>
                    <option value="8">Semester 8</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-purple-300">Previous Year Marks (%) *</label>
                  <input
                    type="number"
                    name="previousYearMarks"
                    value={formData.previousYearMarks}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Enter percentage (0-100)"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-purple-300">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="student@example.com"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Student Data Display */
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <User className="w-6 h-6 mr-3 text-purple-400" />
                Student Profile
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 p-4 rounded-xl border border-green-500/20">
                  <p className="text-sm text-green-300 mb-1">Department</p>
                  <p className="font-semibold text-lg">{studentData.department}</p>
                </div>
                <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 p-4 rounded-xl border border-yellow-500/20">
                  <p className="text-sm text-yellow-300 mb-1">Specialization</p>
                  <p className="font-semibold text-lg">{studentData.branch || "General"}</p>
                </div>
                <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 p-4 rounded-xl border border-indigo-500/20">
                  <p className="text-sm text-indigo-300 mb-1">Current Year</p>
                  <p className="font-semibold text-lg">{studentData.currentYear}</p>
                </div>
                <div className="bg-gradient-to-br from-red-600/20 to-pink-600/20 p-4 rounded-xl border border-red-500/20">
                  <p className="text-sm text-red-300 mb-1">Previous Year Marks</p>
                  <p className="font-semibold text-lg">{studentData.previousYearMarks}%</p>
                </div>
              </div>
            </div>
          )}

          {/* Progress Prediction Dashboard */}
          {studentData && studentData.progressPrediction && (
            <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20">
              <h2 className="text-3xl font-bold mb-8 flex items-center">
                <TrendingUp className="w-8 h-8 mr-4 text-purple-400" />
                Progress Prediction Analysis
              </h2>

              {/* Score Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center bg-white/10 rounded-2xl p-6 border border-white/20">
                  <div className="text-5xl font-bold text-purple-400 mb-2">
                    {studentData.progressPrediction.overallScore}
                  </div>
                  <div className="text-lg text-purple-300 mb-1">Overall Score</div>
                  <div className="text-sm text-white/70">out of 100</div>
                </div>
                
                <div className="text-center bg-white/10 rounded-2xl p-6 border border-white/20">
                  <div className="text-5xl font-bold text-pink-400 mb-2">
                    {studentData.progressPrediction.grade}
                  </div>
                  <div className="text-lg text-pink-300 mb-1">Grade</div>
                  <div className="text-sm text-white/70">predicted</div>
                </div>
                
                <div className="text-center bg-white/10 rounded-2xl p-6 border border-white/20">
                  <div className="text-2xl font-bold text-green-400 mb-2">
                    {studentData.progressPrediction.prediction.split(' ')[0]}
                  </div>
                  <div className="text-lg text-green-300 mb-1">Progress</div>
                  <div className="text-sm text-white/70">expected</div>
                </div>
              </div>

              {/* Prediction Statement */}
              <div className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-xl p-6 mb-8 border border-purple-400/30">
                <h3 className="text-xl font-semibold mb-3 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-yellow-400" />
                  Prediction Summary
                </h3>
                <p className="text-lg font-medium text-center">
                  {studentData.progressPrediction.prediction}
                </p>
              </div>

              {/* Analysis Factors */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-blue-400" />
                  Analysis Factors
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {studentData.progressPrediction.factors.map((factor, idx) => (
                    <div key={idx} className="bg-white/5 rounded-xl p-5 border border-white/10">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-medium text-white">{factor.factor}</span>
                        <span className="text-xs bg-purple-600/30 px-2 py-1 rounded-full text-purple-300">
                          {factor.weight}
                        </span>
                      </div>
                      <div className="mb-3">
                        <div className="w-full bg-gray-700 rounded-full h-3">
                          <div
                            className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                            style={{ width: `${(factor.score / 20) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-white/70">Status:</span>
                        <span className="text-purple-300 font-medium">{factor.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-green-400" />
                  Personalized Recommendations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {studentData.progressPrediction.recommendations.map((rec, idx) => (
                    <div key={idx} className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-xl p-4 border border-green-500/20 flex items-start">
                      <ChevronRight className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-white">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Welcome Message for New Users */}
          {!studentData && !isEditing && (
            <div className="text-center py-16">
              <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl p-12 border border-purple-500/20 max-w-2xl mx-auto">
                <GraduationCap className="w-16 h-16 text-purple-400 mx-auto mb-6" />
                <h2 className="text-3xl font-bold mb-4">Welcome to Progress Tracker</h2>
                <p className="text-lg text-white/70 mb-8">
                  Track your academic progress with AI-powered predictions and personalized recommendations.
                </p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl font-semibold text-lg transition-all transform hover:scale-105"
                >
                  Get Started
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
