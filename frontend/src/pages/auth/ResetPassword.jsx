
import {
  Lock,
  LockOpen,
  Loader2,
  CheckCircle,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react";
import { handleResetPassword, clearError } from "../../store/slices/authSlice"; // Adjust path as needed


const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  // State to hold the token from the query string
  const [token, setToken] = useState(null);
  const [tokenError, setTokenError] = useState(null); // State for token loading error

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Use useLocation hook
  const { loading, error: reduxError } = useSelector((state) => state.auth); // Rename error to avoid conflict

  // Effect to extract token from URL query string on mount
  useEffect(() => {
    // Clear any existing Redux errors first
    dispatch(clearError());
    setTokenError(null); // Clear local token error

    const searchParams = new URLSearchParams(location.search);
    const urlToken = searchParams.get("token"); // Get 'token' from ?token=...

    if (urlToken) {
      setToken(urlToken);
      console.log("Token found in URL:", urlToken); // For debugging
    } else {
      console.error("Reset token missing from URL query parameters.");
      setTokenError(
        "Password reset token not found in the URL. Please use the link from your email again."
      );
      // Optionally navigate away or show a persistent error
      // navigate('/forgot-password');
    }

    // Cleanup function for Redux error
    return () => {
      dispatch(clearError());
    };
  }, [location, dispatch]); // Depend on location and dispatch

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (isSubmitted) setIsSubmitted(false);
    if (reduxError) dispatch(clearError()); // Clear error on input change
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (isSubmitted) setIsSubmitted(false);
    if (reduxError) dispatch(clearError()); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    setIsSubmitted(false);

    // Check if token was loaded successfully
    if (!token) {
      setTokenError(
        "Cannot reset password without a valid token from the URL."
      );
      return;
    }
    if (tokenError) return; // Don't submit if there was an initial token error

    if (!password || !confirmPassword) {
      toast.error("Please enter and confirm your new password.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    // Now we are sure 'token' state variable has the value from the URL
    dispatch(handleResetPassword({ token, newPassword: password }))
      .unwrap()
      .then(() => {
        setIsSubmitted(true);
        setPassword("");
        setConfirmPassword("");
        toast.success("Password reset successfully!");
      })
      .catch((err) => {

        setIsSubmitted(false);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex flex-col justify-center items-center px-4">
      <main className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-2xl p-8 space-y-6 border border-gray-200">
          <h2 className="text-3xl font-bold mb-2 text-center text-green-800 flex items-center justify-center gap-2">
            <LockOpen size={28} />
            Reset Password
          </h2>

          {/* Show instructions only if token exists and form not submitted */}
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

          {/* Only show form if token exists and not successfully submitted */}
          {!tokenError && !isSubmitted && (
            <form onSubmit={handleSubmit} className="space-y-5">
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
                    placeholder="********"
                    className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm disabled:bg-gray-100"
                    required
                    minLength={6} // Add minLength
                    disabled={loading || isSubmitted}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm New Password <span className="text-red-500">*</span>
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
                    placeholder="********"
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
                  disabled={loading || isSubmitted || !token} // Also disable if token is missing
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

          {/* Back to Login Link (Show if form was visible or if there was only a token error) */}
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
        </div>
      </main>

      <footer className="mt-8 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Project Ultron. Environmental Monitoring.
      </footer>
    </div>
  );
};


export default ResetPassword;
