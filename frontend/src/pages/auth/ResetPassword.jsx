/*
=============================
        Imports
=============================
*/
import {
  Lock,
  LockOpen,
  Loader2,
  CheckCircle,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react";
import { handleResetPassword, clearError } from "../../store/slices/authSlice";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";

/*
=============================
      ResetPassword Page
=============================
*/
const ResetPassword = () => {
  // =========================
  //    Local State & Hooks
  // =========================
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [token, setToken] = useState(null);
  const [tokenError, setTokenError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error: reduxError } = useSelector((state) => state.auth);

  /*
	==============================
	  Effect: Parse Token from URL
	==============================
	*/
  useEffect(() => {
    dispatch(clearError());
    setTokenError(null);

    const searchParams = new URLSearchParams(location.search);
    const urlToken = searchParams.get("token");

    if (urlToken) {
      setToken(urlToken);
      console.log("Token found in URL:", urlToken);
    } else {
      console.error("Reset token missing from URL query parameters.");
      setTokenError(
        "Password reset token not found in the URL. Please use the link from your email again."
      );
    }

    return () => {
      dispatch(clearError());
    };
  }, [location, dispatch]);

  /*
	==============================
		Handlers for Form Fields
	==============================
	*/
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (isSubmitted) setIsSubmitted(false);
    if (reduxError) dispatch(clearError());
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (isSubmitted) setIsSubmitted(false);
    if (reduxError) dispatch(clearError());
  };

  /*
	==============================
	    Form Submission Handler
	==============================
	*/
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    setIsSubmitted(false);

    if (!token) {
      setTokenError(
        "Cannot reset password without a valid token from the URL."
      );
      return;
    }
    if (tokenError) return;

    if (!password || !confirmPassword) {
      toast.error("Please enter and confirm your new password.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    dispatch(handleResetPassword({ token, newPassword: password }))
      .unwrap()
      .then(() => {
        setIsSubmitted(true);
        setPassword("");
        setConfirmPassword("");
        toast.success("Password reset successfully!");
        // Optionally redirect after a delay:
        // setTimeout(() => navigate("/login"), 2000);
      })
      .catch(() => {
        setIsSubmitted(false);
      });
  };

  /*
	==============================
	       Page Render
	==============================
	*/
  return (
    <div className="min-h-screen">
      {/* If you use a background/animation wrapper, keep this as is, or remove if not needed */}
      <EnvironmentBackgroundLayers>
        <div className="flex justify-center items-center align-items-center px-4 py-25">
          <main className="w-full max-w-md">
            <div className="bg-white rounded-xl shadow-2xl p-8 space-y-6 border border-gray-200">
              {/* Title */}
              <h2 className="text-3xl font-bold mb-2 text-center text-green-800 flex items-center justify-center gap-2">
                <LockOpen size={28} />
                Reset Password
              </h2>

              {/* Instructions */}
              {token && !isSubmitted && !tokenError && (
                <p className="text-center text-gray-600 text-sm mb-6">
                  Enter your new password below.
                </p>
              )}

              {/* --- Feedback Area --- */}
              {/* Token Error */}
              {tokenError && (
                <div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm mb-4 flex items-center gap-2"
                  role="alert"
                >
                  <AlertTriangle size={18} />
                  <span className="block sm:inline">{tokenError}</span>
                </div>
              )}

              {/* Redux Error */}
              {reduxError && !isSubmitted && (
                <div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm mb-4"
                  role="alert"
                >
                  <span className="block sm:inline">{reduxError}</span>
                </div>
              )}

              {/* Success Message */}
              {isSubmitted && !reduxError && (
                <div
                  className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative text-sm mb-4 flex items-center gap-2"
                  role="alert"
                >
                  <CheckCircle size={18} />
                  <span className="block sm:inline">
                    Password has been reset successfully! You can now{" "}
                    <Link
                      to="/login"
                      className="font-bold text-green-800 underline hover:text-green-600"
                    >
                      Login
                    </Link>
                    .
                  </span>
                </div>
              )}
              {/* --- End Feedback Area --- */}

              {/* --- Password Reset Form --- */}
              {!tokenError && !isSubmitted && (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* New Password */}
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      New Password <span className="text-red-500">*</span>
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
                        value={password}
                        onChange={handlePasswordChange}
                        className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm disabled:bg-gray-100"
                        required
                        minLength={6}
                        disabled={loading || isSubmitted}
                      />
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Confirm New Password{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm disabled:bg-gray-100"
                        required
                        disabled={loading || isSubmitted}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div>
                    <button
                      type="submit"
                      disabled={loading || isSubmitted || !token}
                      className={`w-full flex justify-center items-center px-6 py-3 mt-2 ${
                        loading || isSubmitted || !token
                          ? "bg-green-400 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700"
                      } text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200`}
                    >
                      {loading ? (
                        <Loader2 className="animate-spin mr-2" size={20} />
                      ) : (
                        <LockOpen size={18} className="mr-2" />
                      )}
                      {loading ? "Resetting..." : "Reset Password"}
                    </button>
                  </div>
                </form>
              )}
              {/* --- End Form --- */}

              {/* --- Back to Login Link --- */}
              {(!isSubmitted || tokenError) && (
                <div className="text-center mt-6">
                  <Link
                    to="/login"
                    className="text-sm text-green-600 hover:text-green-800 hover:underline inline-flex items-center gap-1"
                  >
                    <ArrowLeft size={16} />
                    Back to Login
                  </Link>
                </div>
              )}
              {/* --- End Back Link --- */}
            </div>
          </main>
        </div>
      </EnvironmentBackgroundLayers>
    </div>
  );
};

/*
=============================
      Export Component
=============================
*/
export default ResetPassword;
