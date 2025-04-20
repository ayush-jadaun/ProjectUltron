/*
=============================
        Imports
=============================
*/
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  MailWarning,
  Home,
  LogIn,
} from "lucide-react";
import {
  handleEmailVerification,
  clearError,
} from "../../store/slices/authSlice";

/*
=============================
      VerifyEmail Component
=============================
*/
const VerifyEmail = () => {
  // =========================
  //    Local State & Hooks
  // =========================
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = searchParams.get("token");

  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [verificationStatus, setVerificationStatus] = useState("pending");

  /*
  =============================
    Effect: Handle Verification
  =============================
  */
  useEffect(() => {
    dispatch(clearError());

    if (!token) {
      setVerificationStatus("noToken");
      return; 
    }

    setVerificationStatus("pending");
    dispatch(handleEmailVerification(token))
      .unwrap()
      .then(() => {
        setVerificationStatus("success");
      })
      .catch((errMessage) => {
        if (
          typeof errMessage === "string" &&
          errMessage.toLowerCase().includes("already verified")
        ) {
          setVerificationStatus("alreadyVerified");
        } else {
          setVerificationStatus("error");
        }
      });


  }, [dispatch, token]);

  /*
  =============================
        Render Content
  =============================
  */
  const renderContent = () => {
    // No token in URL
    if (verificationStatus === "noToken") {
      return (
        <div className="text-center space-y-4">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="text-xl font-semibold text-red-700">
            Invalid Verification Link
          </h3>
          <p className="text-gray-600">
            The verification link is missing the required token. Please ensure
            you copied the entire link from your email.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            <LogIn size={18} className="mr-2" /> Go to Login
          </Link>
        </div>
      );
    }

    // Pending or loading state
    if (loading || verificationStatus === "pending") {
      return (
        <div className="text-center space-y-4">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-green-600" />
          <h3 className="text-xl font-semibold text-gray-700">
            Verifying your email...
          </h3>
          <p className="text-gray-500">Please wait a moment.</p>
        </div>
      );
    }

    // Success (verified and logged in)
    if (verificationStatus === "success" && isAuthenticated) {
      return (
        <div className="text-center space-y-4">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
          <h3 className="text-xl font-semibold text-green-700">
            Email Verified Successfully!
          </h3>
          <p className="text-gray-600">
            Your account is now active. You have been automatically logged in.
          </p>
          <Link
            to="/" 
            className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors"
          >
            <Home size={18} className="mr-2" /> Go to Dashboard
          </Link>
        </div>
      );
    }

    // Already verified
    if (verificationStatus === "alreadyVerified") {
      return (
        <div className="text-center space-y-4">
          <CheckCircle className="mx-auto h-12 w-12 text-blue-500" />
          <h3 className="text-xl font-semibold text-blue-700">
            Email Already Verified
          </h3>
          <p className="text-gray-600">
            This email address has already been verified. You can log in to your
            account.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            <LogIn size={18} className="mr-2" /> Go to Login
          </Link>
        </div>
      );
    }

    // Error state
    if (error || verificationStatus === "error") {
      return (
        <div className="text-center space-y-4">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="text-xl font-semibold text-red-700">
            Verification Failed
          </h3>
          <p className="text-gray-600">
            {error ||
              "The verification link may be invalid or expired. Please try requesting a new verification email."}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-4">
            <Link
              to="/request-verification"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
            >
              <MailWarning size={18} className="mr-2" /> Resend Verification
              Email
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <LogIn size={18} className="mr-2" /> Back to Login
            </Link>
          </div>
        </div>
      );
    }

    // Fallback (should not be reached)
    return (
      <div className="text-center text-gray-500">
        Checking verification status...
      </div>
    );
  };

  /*
  =============================
          Component Render
  =============================
  */
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex flex-col justify-center items-center px-4">
      <main className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-2xl p-8 space-y-6 border border-gray-200">
          {renderContent()}
        </div>
      </main>
      <footer className="mt-8 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Project Ultron. Environmental Monitoring.
      </footer>
    </div>
  );
};

/*
=============================
      Export Component
=============================
*/
export default VerifyEmail;
