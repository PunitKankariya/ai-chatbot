import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
    fullName: "",
    studentId: "",
    branch: "",
    year: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    // Accepts various phone formats: +1234567890, (123) 456-7890, 123-456-7890, etc.
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$|^[\(]?[\d]{3}[\)]?[\s\-]?[\d]{3}[\s\-]?[\d]{4}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    // Validation
    if (!formData.fullName.trim()) {
      setError("Please enter your full name");
      setIsSubmitting(false);
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email address");
      setIsSubmitting(false);
      return;
    }

    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address");
      setIsSubmitting(false);
      return;
    }

    if (!formData.phone.trim()) {
      setError("Please enter your phone number");
      setIsSubmitting(false);
      return;
    }

    if (!validatePhone(formData.phone)) {
      setError("Please enter a valid phone number");
      setIsSubmitting(false);
      return;
    }

    if (!formData.password) {
      setError("Please enter a password");
      setIsSubmitting(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      setIsSubmitting(false);
      return;
    }

    if (!formData.studentId.trim()) {
      setError("Please enter your student ID");
      setIsSubmitting(false);
      return;
    }

    if (!formData.branch.trim()) {
      setError("Please enter your branch/specialization");
      setIsSubmitting(false);
      return;
    }

    if (!formData.year.trim()) {
      setError("Please select your year");
      setIsSubmitting(false);
      return;
    }

    try {
      // TODO: Wire to real auth API
      await new Promise((r) => setTimeout(r, 2000));
      
      // Save basic user profile to localStorage
      const userProfile = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        studentId: formData.studentId,
        branch: formData.branch,
        year: formData.year,
        registrationDate: new Date().toISOString()
      };
      
      localStorage.setItem("userProfile", JSON.stringify(userProfile));
      
      setSuccess("Account created successfully! Redirecting to login...");
      
      // Redirect to login after success
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
      
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-purple-950 text-white">
      <div className="w-full h-screen overflow-y-auto">
        <div className="flex justify-center items-start min-h-full py-8 px-4">
          <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/10">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="text-white/70 text-sm mt-1">Join us today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="mb-4">
            <label className="block text-sm mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label className="block text-sm mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your phone number"
              required
            />
          </div>

          {/* Student ID */}
          <div className="mb-4">
            <label className="block text-sm mb-1">Student ID</label>
            <input
              type="text"
              name="studentId"
              value={formData.studentId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your student ID"
              required
            />
          </div>

          {/* Branch */}
          <div className="mb-4">
            <label className="block text-sm mb-1">Branch</label>
            <select
              name="branch"
              value={formData.branch}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-lg bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.5rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em'
              }}
              required
            >
              <option value="" className="bg-gray-800 text-white">Select Branch</option>
              <option value="CS" className="bg-gray-800 text-white">Computer Science (CS)</option>
              <option value="IT" className="bg-gray-800 text-white">Information Technology (IT)</option>
              <option value="ECM" className="bg-gray-800 text-white">Electronics & Computer Engineering (ECM)</option>
              <option value="ENTC" className="bg-gray-800 text-white">Electronics & Telecommunication (ENTC)</option>
              <option value="Civil" className="bg-gray-800 text-white">Civil Engineering</option>
              <option value="Mech" className="bg-gray-800 text-white">Mechanical Engineering</option>
              <option value="Other" className="bg-gray-800 text-white">Other</option>
            </select>
          </div>

          {/* Year */}
          <div className="mb-4">
            <label className="block text-sm mb-1">Year</label>
            <select
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-lg bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.5rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em'
              }}
              required
            >
              <option value="" className="bg-gray-800 text-white">Select Year</option>
              <option value="1st Year" className="bg-gray-800 text-white">1st Year</option>
              <option value="2nd Year" className="bg-gray-800 text-white">2nd Year</option>
              <option value="3rd Year" className="bg-gray-800 text-white">3rd Year</option>
              <option value="4th Year" className="bg-gray-800 text-white">4th Year</option>
            </select>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your password"
              required
            />
          </div>


          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30">
              <p className="text-sm text-red-300" role="alert">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-3 rounded-lg bg-green-500/20 border border-green-500/30">
              <p className="text-sm text-green-300" role="alert">{success}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/60 transition-colors font-medium"
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-xs text-white/60">
            Already have an account? {" "}
            <Link to="/login" className="text-purple-300 hover:text-purple-200 underline">
              Log in here
            </Link>
          </p>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
}
