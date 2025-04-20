/*
=============================
        Imports
=============================
*/
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PublicRoute from "./utils/PublicRoutes";

// Page Components
import LoginSignup from "./pages/auth/LoginSignup";
import HomePage from "./pages/homePage";
import UserProfile from "./pages/user/UserProfile";
import AnalysisPage from "./pages/user/analysisPage";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import SubscribeLocationPage from "./pages/SubscribeLocationPage";
import GreenIndex from "./pages/infoPages/GreenIndex";
import Flood from "./pages/infoPages/Flood";
import Glaciers from "./pages/infoPages/Glaciers";
import Beach from "./pages/infoPages/Beach";
import Fire from "./pages/infoPages/Fire";
import HistoricalChangePage from "./pages/HistoricalChangePage";
import RealtimeSatelliteMap from "./pages/satellite";
import AboutUs from "./pages/AboutUs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Contact from "./pages/Contact";

/*
=============================
        Main App
=============================
*/
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

/*
=============================
        App Content
=============================
*/
function AppContent() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          /*
		==============================
				 Public Routes
        =============================
		   */
          <Route path="/" element={<HomePage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/green" element={<GreenIndex />} />
          <Route path="/flood" element={<Flood />} />
          <Route path="/ice" element={<Glaciers />} />
          <Route path="/fire" element={<Fire />} />
          <Route path="/coast" element={<Beach />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/satellite" element={<RealtimeSatelliteMap />} />
          <Route path="/history" element={<HistoricalChangePage />} />
          <Route
            path="/reset-password/:resetToken"
            element={<ResetPassword />}
          />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/analysis" element={<AnalysisPage />} />
          <Route path="/map" element={<SubscribeLocationPage />} />
          /*
		   ==============================
		    Public-only Route (for login)
		   ============================== */
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginSignup />
              </PublicRoute>
            }
          />
          /*
		   ==============================
		    		Catch-All Route
           ============================== */
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

/*
=============================
        Export App
=============================
*/
export default App;
