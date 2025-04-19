import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  // useLocation, // No longer needed in this simplified version
} from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux"; // No longer needed here
// import { checkAuthStatus } from "./store/slices/authSlice"; // No longer needed here
import PublicRoute from "./utils/PublicRoutes"; // Still used for /login
// import ProtectedRoute from "./utils/ProtectedRoutes"; // Commented out/removed usage

// Page Components
import LoginSignup from "./pages/auth/LoginSignup";
import HomePage from "./pages/homePage";
import UserProfile from "./pages/user/UserProfile"; // Corrected import if needed
import AnalysisPage from "./pages/user/analysisPage";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import GreenIndex from "./pages/GreenIndex";
import Flood from "./pages/Flood";

function App() {
  // const dispatch = useDispatch(); // No longer needed here

  // You might still want to dispatch checkAuthStatus somewhere,
  // perhaps once when the app loads, independent of routing,
  // or inside the Navbar component if user info is displayed there.
  // useEffect(() => {
  //   dispatch(checkAuthStatus());
  // }, [dispatch]);

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* --- Now essentially all Public Routes --- */}
          <Route path="/" element={<HomePage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/green" element={<GreenIndex />} />
          <Route path="/flood" element={<Flood />} />
          <Route
            path="/reset-password/:resetToken"
            element={<ResetPassword />}
          />{" "}
          {/* Assuming token in URL */}
          {/* --- User Profile (now public) --- */}
          <Route path="/profile" element={<UserProfile />} />
          {/* --- Analysis Page (now public) --- */}
          <Route path="/analysis" element={<AnalysisPage />} />
          {/* --- Public-only route (not for logged-in users) --- */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                {" "}
                {/* Keeps redirecting logged-in users away from /login */}
                <LoginSignup />
              </PublicRoute>
            }
          />
          {/* --- Example Structure for when Protected Routes are re-enabled --- */}
          {/*
					<Route
						path="/profile"
						element={
							<ProtectedRoute>
								<UserProfile />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/analysis"
						element={
							<ProtectedRoute>
								<AnalysisPage />
							</ProtectedRoute>
						}
					/>
					 */}
          {/* --- Catch-All Route --- */}
          {/* Redirects any unmatched URL back to the homepage */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
