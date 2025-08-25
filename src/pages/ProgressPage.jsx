import React, { useMemo, useState, useEffect } from "react";
import AppLayout from "../components/ui/AppLayout";
import { User, GraduationCap, TrendingUp, Target, Award, Brain, ChevronRight, Plus, Edit3, Save, X } from "lucide-react";

export default function ProgressPage() {
  const [stats] = useState({
    quizzes: { attempted: 12, passed: 9 },
    notesCreated: 32,
  });

  const [studentData, setStudentData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    studentId: "",
    degree: "",
    department: "",
    specialization: "",
    currentYear: "",
    currentSemester: "",
    twelfthMarks: "",
    previousYearMarks: "",
    cgpa: "",
    email: "",
    phone: ""
  });

  const passRate = useMemo(() => {
    if (stats.quizzes.attempted === 0) return 0;
    return Math.round((stats.quizzes.passed / stats.quizzes.attempted) * 100);
  }, [stats]);

  // Progress prediction algorithm
  const calculateProgressPrediction = (data) => {
    let score = 0;
    let factors = [];

    // Previous year marks factor (40%)
    const actualMarks = parseFloat(data.previousYearMarks) || 0;
    const marksPercentage = (actualMarks / 100) * 40;
    score += marksPercentage;
    factors.push({
      factor: "Previous Year Performance",
      score: marksPercentage,
      weight: "40%",
      percentage: actualMarks,
      status: actualMarks >= 80 ? "Excellent" : actualMarks >= 70 ? "Good" : actualMarks >= 60 ? "Average" : "Needs Improvement"
    });

    // Department difficulty factor (20%)
    const deptDifficulty = {
      "Computer Science": 0.9,
      "Information Technology": 0.85,
      "Electronics & Communication": 0.8,
      "Mechanical Engineering": 0.75,
      "Civil Engineering": 0.7,
      "Electrical Engineering": 0.75,
      "Chemical Engineering": 0.8,
      "Aerospace Engineering": 0.85,
      "Biotechnology": 0.8
    };
    const deptMultiplier = deptDifficulty[data.department] || 0.7;
    const deptScore = deptMultiplier * 20;
    const deptPercentage = deptMultiplier * 100;
    score += deptScore;
    factors.push({
      factor: "Department Complexity",
      score: deptScore,
      weight: "20%",
      percentage: Math.round(deptPercentage),
      status: deptPercentage >= 80 ? "High Challenge" : deptPercentage >= 70 ? "Moderate" : "Manageable"
    });

    // Current year factor (20%)
    const yearMultiplier = {
      "1st Year": 0.9,
      "2nd Year": 0.8,
      "3rd Year": 0.7,
      "4th Year": 0.6
    };
    const yearMultiplier_val = yearMultiplier[data.currentYear] || 0.7;
    const yearScore = yearMultiplier_val * 20;
    const yearPercentage = yearMultiplier_val * 100;
    score += yearScore;
    factors.push({
      factor: "Academic Year Difficulty",
      score: yearScore,
      weight: "20%",
      percentage: Math.round(yearPercentage),
      status: data.currentYear === "1st Year" ? "Foundation Year" : data.currentYear === "4th Year" ? "Final Year Pressure" : "Core Learning Phase"
    });

    // Specialization factor (20%)
    const specializationComplexity = {
      "AI/ML": 0.95,
      "Artificial Intelligence": 0.95,
      "Data Science": 0.9,
      "Machine Learning": 0.9,
      "Software Engineering": 0.85,
      "Cybersecurity": 0.8,
      "Cyber Security": 0.8,
      "Web Development": 0.75,
      "Mobile Development": 0.75,
      "General": 0.7
    };
    const specializationMultiplier = specializationComplexity[data.specialization] || 0.7;
    const specializationScore = specializationMultiplier * 20;
    const specializationPercentage = specializationMultiplier * 100;
    score += specializationScore;
    factors.push({
      factor: "Specialization Complexity",
      score: specializationScore,
      weight: "20%",
      percentage: Math.round(specializationPercentage),
      status: specializationPercentage >= 90 ? "Highly Specialized" : specializationPercentage >= 75 ? "Specialized" : "General Track"
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
    
    if (data.degree === "B.Tech" || data.degree === "BCA" || data.degree === "M.Tech") {
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
      <div className="h-full text-white overflow-y-auto">
        <div className="p-6 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
              📊 Progress Dashboard
            </h1>
            {studentData && (
              <div className="flex items-center gap-2">
                {isEditing ? (
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
                    Edit Profile
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Activity Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl border border-purple-500/20 p-4">
              <p className="text-sm text-purple-300">Notes Created</p>
              <p className="text-3xl font-bold mt-2">{stats.notesCreated}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-xl border border-blue-500/20 p-4">
              <p className="text-sm text-blue-300">Quizzes Attempted</p>
              <p className="text-3xl font-bold mt-2">{stats.quizzes.attempted}</p>
            </div>
            <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-xl border border-green-500/20 p-4">
              <p className="text-sm text-green-300">Quiz Pass Rate</p>
              <div className="mt-2 w-full bg-white/10 rounded-full h-3">
                <div
                  className="h-3 rounded-full bg-green-500"
                  style={{ width: `${passRate}%` }}
                />
              </div>
              <p className="text-sm mt-1">{passRate}%</p>
            </div>
          </div>


          {/* Student Progress Tracker Section */}
          <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-2xl p-6 border border-indigo-500/20">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <TrendingUp className="w-6 h-6 mr-3 text-indigo-400" />
              Academic Progress Tracker
            </h2>

            {/* Student Data Input/Display */}
            {isEditing || !studentData ? (
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 mb-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-purple-400" />
                  Student Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div>
                    <label className="block text-sm font-medium mb-2 text-purple-300">Department *</label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 0.5rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.5em 1.5em'
                      }}
                      required
                    >
                      <option value="" className="bg-gray-800 text-white">Select Department</option>
                      <option value="Computer Science" className="bg-gray-800 text-white">Computer Science & Engineering</option>
                      <option value="Information Technology" className="bg-gray-800 text-white">Information Technology</option>
                      <option value="Electronics & Communication" className="bg-gray-800 text-white">Electronics & Communication Engineering</option>
                      <option value="Mechanical Engineering" className="bg-gray-800 text-white">Mechanical Engineering</option>
                      <option value="Civil Engineering" className="bg-gray-800 text-white">Civil Engineering</option>
                      <option value="Electrical Engineering" className="bg-gray-800 text-white">Electrical Engineering</option>
                      <option value="Chemical Engineering" className="bg-gray-800 text-white">Chemical Engineering</option>
                      <option value="Aerospace Engineering" className="bg-gray-800 text-white">Aerospace Engineering</option>
                      <option value="Automobile Engineering" className="bg-gray-800 text-white">Automobile Engineering</option>
                      <option value="Biotechnology" className="bg-gray-800 text-white">Biotechnology</option>
                      <option value="Biomedical Engineering" className="bg-gray-800 text-white">Biomedical Engineering</option>
                      <option value="Environmental Engineering" className="bg-gray-800 text-white">Environmental Engineering</option>
                      <option value="Mathematics" className="bg-gray-800 text-white">Mathematics</option>
                      <option value="Physics" className="bg-gray-800 text-white">Physics</option>
                      <option value="Chemistry" className="bg-gray-800 text-white">Chemistry</option>
                      <option value="Biology" className="bg-gray-800 text-white">Biology</option>
                      <option value="Business Administration" className="bg-gray-800 text-white">Business Administration</option>
                      <option value="Management" className="bg-gray-800 text-white">Management Studies</option>
                      <option value="Finance" className="bg-gray-800 text-white">Finance</option>
                      <option value="Marketing" className="bg-gray-800 text-white">Marketing</option>
                      <option value="Human Resources" className="bg-gray-800 text-white">Human Resources</option>
                      <option value="Economics" className="bg-gray-800 text-white">Economics</option>
                      <option value="English" className="bg-gray-800 text-white">English Literature</option>
                      <option value="History" className="bg-gray-800 text-white">History</option>
                      <option value="Political Science" className="bg-gray-800 text-white">Political Science</option>
                      <option value="Psychology" className="bg-gray-800 text-white">Psychology</option>
                      <option value="Other" className="bg-gray-800 text-white">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-purple-300">Specialization</label>
                    <input
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="e.g., AI/ML, Data Science, Cyber Security, etc."
                    />
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
                    <label className="block text-sm font-medium mb-2 text-purple-300">12th Grade Marks (%)</label>
                    <input
                      type="number"
                      name="twelfthMarks"
                      value={formData.twelfthMarks}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Enter 12th grade percentage"
                    />
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
                      placeholder="Enter previous year percentage"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-purple-300">CGPA</label>
                    <input
                      type="number"
                      name="cgpa"
                      value={formData.cgpa}
                      onChange={handleInputChange}
                      min="0"
                      max="10"
                      step="0.01"
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Enter CGPA (0.0 - 10.0)"
                    />
                  </div>
                </div>

                {!studentData && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={handleSave}
                      className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl font-semibold text-lg transition-all transform hover:scale-105"
                    >
                      Analyze Progress
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Student Data Display */
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 mb-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-purple-400" />
                  Student Profile
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 p-4 rounded-xl border border-yellow-500/20">
                    <p className="text-sm text-yellow-300 mb-1">Specialization</p>
                    <p className="font-semibold text-lg">{studentData.specialization || "General"}</p>
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
              <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-yellow-400" />
                  Progress Prediction Analysis
                </h3>

                {/* Score Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center bg-white/10 rounded-xl p-4 border border-white/20">
                    <div className="text-3xl font-bold text-purple-400 mb-1">
                      {studentData.progressPrediction.overallScore}
                    </div>
                    <div className="text-sm text-purple-300">Overall Score</div>
                  </div>
                  
                  <div className="text-center bg-white/10 rounded-xl p-4 border border-white/20">
                    <div className="text-3xl font-bold text-pink-400 mb-1">
                      {studentData.progressPrediction.grade}
                    </div>
                    <div className="text-sm text-pink-300">Grade</div>
                  </div>
                  
                  <div className="text-center bg-white/10 rounded-xl p-4 border border-white/20">
                    <div className="text-lg font-bold text-green-400 mb-1">
                      {studentData.progressPrediction.prediction.split(' ')[0]}
                    </div>
                    <div className="text-sm text-green-300">Progress</div>
                  </div>
                </div>


                {/* Recommendations */}
                <div>
                  <h4 className="text-lg font-semibold mb-4 flex items-center">
                    <Target className="w-4 h-4 mr-2 text-green-400" />
                    Recommendations
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {studentData.progressPrediction.recommendations.slice(0, 6).map((rec, idx) => (
                      <div key={idx} className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-lg p-3 border border-green-500/20 flex items-start">
                        <ChevronRight className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-white">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Welcome Message for New Users */}
            {!studentData && !isEditing && (
              <div className="text-center py-12">
                <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl p-8 border border-purple-500/20 max-w-lg mx-auto">
                  <GraduationCap className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-3">Track Your Academic Progress</h3>
                  <p className="text-white/70 mb-6">
                    Get AI-powered predictions and personalized recommendations based on your academic data.
                  </p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold transition-all transform hover:scale-105"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}