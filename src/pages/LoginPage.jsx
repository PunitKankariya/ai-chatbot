import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
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
    setIsSubmitting(true);

    // Validation
    if (!formData.emailOrPhone.trim()) {
      setError("Please enter your email address or phone number");
      setIsSubmitting(false);
      return;
    }

    if (!formData.password) {
      setError("Please enter your password");
      setIsSubmitting(false);
      return;
    }

    // Validate email or phone format
    const input = formData.emailOrPhone.trim();
    const isEmail = validateEmail(input);
    const isPhone = validatePhone(input);

    if (!isEmail && !isPhone) {
      setError("Please enter a valid email address or phone number");
      setIsSubmitting(false);
      return;
    }

    try {
      // TODO: Wire to real auth API
      await new Promise((r) => setTimeout(r, 1000));
      // On success, redirect to chat for now
      window.location.href = "/chat";
    } catch (err) {
      setError("Login failed. Please check your credentials and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-purple-950 text-white px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/10">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-white/70 text-sm mt-1">Log in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email or Phone Number</label>
            <input
              type="text"
              name="emailOrPhone"
              value={formData.emailOrPhone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="you@example.com or +1 (555) 123-4567"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30">
              <p className="text-sm text-red-300" role="alert">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/60 transition-colors font-medium"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-xs text-white/60">
            Don't have an account? {" "}
            <Link to="/signup" className="text-purple-300 hover:text-purple-200 underline">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}


