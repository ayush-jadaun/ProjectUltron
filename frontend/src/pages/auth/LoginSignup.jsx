// src/pages/LoginSignup.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Mail,
  Lock,
  User,
  Building,
  PhoneIcon,
  MapPin,
  LogIn,
  UserPlus,
  Loader2,
} from "lucide-react";
import { handleSignIn, handleSignUp, clearError } from "../../store/slices/authSlice"; // Import your auth actions


function LoginSignup() {
  const [isLogin, setIsLogin] = useState(true); // Default to login view
  const [formData, setFormData] = useState({
    name: "",
    user_type: "normal", // Default user type
    organization_name: "",
    contact_number: "",
    email: "",
    password: "",
    location: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard"); // Or your main authenticated route
    }
  }, [isAuthenticated, navigate]);

  // Clear errors when switching forms
  useEffect(() => {
    dispatch(clearError());
  }, [isLogin, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear organization name if switching from NGO to normal
    if (name === "user_type" && value === "normal") {
      setFormData((prev) => ({ ...prev, organization_name: "" }));
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    // Reset form data when switching
    setFormData({
      name: "",
      user_type: "normal",
      organization_name: "",
      contact_number: "",
      email: "",
      password: "",
      location: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError()); // Clear previous errors

    if (isLogin) {
      // --- Login Logic ---
      const { email, password } = formData;
      if (!email || !password) {
        toast.error("Please enter both email and password.");
        return;
      }
      dispatch(handleSignIn({ email, password }))
        .unwrap() // Allows catching rejections locally if needed, or use component state based on slice state
        .then(() => {
          toast.success("Login successful!");
          navigate("/dashboard"); // Redirect after successful login
        })
        .catch((err) => {
          // Error is already handled by the slice and stored in `error` state
          // toast.error(err || "Login failed."); // Display error from slice or default
        });
    } else {
      // --- Sign Up Logic ---
      const {
        name,
        user_type,
        organization_name,
        contact_number,
        email,
        password,
        location,
      } = formData;

      // Basic frontend validation (backend does more thorough checks)
      if (!user_type || !contact_number || !email || !password || !location) {
        toast.error("Please fill in all required fields for signup.");
        return;
      }
      if (user_type === "ngo" && !organization_name) {
        toast.error("Organization name is required for NGO users.");
        return;
      }

      dispatch(
        handleSignUp({
          name: name || null,
          user_type,
          organization_name,
          contact_number,
          email,
          password,
          location,
        })
      )
        .unwrap()
        .then((response) => {
          // Response from signup thunk might include a success message
          toast.success(
            response?.message ||
              "Signup successful! Please check your email to verify."
          );
          setIsLogin(true); // Switch to login view after successful signup request
          // Optionally clear form again
          setFormData({
            name: "",
            user_type: "normal",
            organization_name: "",
            contact_number: "",
            email: "",
            password: "",
            location: "",
          });
        })
        .catch((err) => {
          // Error handled by slice
          // toast.error(err || "Signup failed.");
        });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex flex-col justify-center items-center px-4">


      <main className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-2xl p-8 space-y-6 border border-gray-200">
          <h2 className="text-3xl font-bold mb-6 text-center text-green-800 flex items-center justify-center gap-2">
            {isLogin ? <LogIn size={28} /> : <UserPlus size={28} />}
            {isLogin ? "Welcome Back!" : "Create Account"}
          </h2>

          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Conditional Signup Fields */}
            {!isLogin && (
              <>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Name (Optional)
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your Full Name"
                      className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    User Type
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="user_type"
                        value="normal"
                        checked={formData.user_type === "normal"}
                        onChange={handleChange}
                        className="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">Normal User</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="user_type"
                        value="ngo"
                        checked={formData.user_type === "ngo"}
                        onChange={handleChange}
                        className="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">
                        NGO / Organization
                      </span>
                    </label>
                  </div>
                </div>

                {/* Organization Name (Conditional) */}
                {formData.user_type === "ngo" && (
                  <div>
                    <label
                      htmlFor="organization_name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Organization Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Building
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        type="text"
                        id="organization_name"
                        name="organization_name"
                        value={formData.organization_name}
                        onChange={handleChange}
                        placeholder="Name of your Organization"
                        className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        required={formData.user_type === "ngo"} // Required only if NGO is selected
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="contact_number"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <PhoneIcon
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="tel" // Use 'tel' type for phone numbers
                      id="contact_number"
                      name="contact_number"
                      value={formData.contact_number}
                      onChange={handleChange}
                      placeholder="+91 12345 67890"
                      className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {/* Common Fields */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  required
                  minLength={isLogin ? undefined : 6} // Basic password length check for signup
                />
              </div>
              {isLogin && (
                <div className="text-right mt-1">
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")} // Navigate to forgot password page
                    className="text-sm text-green-600 hover:text-green-800 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              )}
            </div>

            {/* Location (Only for Signup) */}
            {!isLogin && (
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Location (City/State) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Mumbai, Maharashtra"
                    className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    required
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center items-center px-6 py-3 mt-2 ${
                  loading
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                } text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200`}
              >
                {loading ? (
                  <Loader2 className="animate-spin mr-2" size={20} />
                ) : null}
                {loading ? "Processing..." : isLogin ? "Log In" : "Sign Up"}
              </button>
            </div>
          </form>

          {/* Toggle Link */}
          <div className="text-center mt-4">
            <button
              onClick={toggleForm}
              className="text-sm text-green-600 hover:text-green-800 hover:underline"
              disabled={loading}
            >
              {isLogin
                ? "Don't have an account? Sign Up"
                : "Already have an account? Log In"}
            </button>
          </div>
        </div>
      </main>

      {/* Optional Footer */}
      <footer className="mt-8 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Project Ultron. Environmental Monitoring.
      </footer>
    </div>
  );
}

export default LoginSignup;
