
import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthStatus } from "./store/slices/authSlice";
import PublicRoute from "./utils/PublicRoutes";
import ProtectedRoute from "./utils/ProtectedRoutes";
// Page Components
import LoginSignup from "./pages/auth/LoginSignup";
import HomePage from "./pages/homePage";

function App() {
  const dispatch = useDispatch();





  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {



  return (
    <div className="flex flex-col min-h-screen">

   
      <main className="flex-grow">
        <Routes>
          {/* --- Public Routes --- */}
          <Route path="/" element={<HomePage />} />
        

          {/* --- Public-only route (not for logged-in users) --- */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginSignup />
              </PublicRoute>
            }
          />

          {/* --- Protected Routes --- */}
          <Route element={<ProtectedRoute />}>
           
          </Route>

          {/* --- Catch-All Route --- */}

        </Routes>
      </main>
    </div>
  );
}

export default App;
