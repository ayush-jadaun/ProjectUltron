import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";

import User from "../models/user.model.js"; 
import {
  getCurrentUser,
  updateUser,
  forgotPassword,
  resetPassword,
  logoutUser,
  registerUser,
  loginUser,
  requestVerificationEmail, 
  verifyEmail,
  getUserById,
  getAllUsers,
} from "../controllers/user.controller.js";

const router = express.Router();

/* ============================= Public Routes ============================== */

// Authentication
router.post("/signup", registerUser); 
router.post("/login", loginUser);

// Password Reset
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Email Verification
router.post("/request-verification", requestVerificationEmail); 
router.get("/verify-email", verifyEmail);

// Get Public User Info (Example)
router.get("/user/:id", getUserById); 

/* ============================ Protected Routes ============================ */
// These routes require a valid JWT (checked by authMiddleware)

// Get Verification Status (for logged-in user)
router.get("/verify-status", authMiddleware, async (req, res, next) => {

  try {

    if (!req.user || !req.user.id) {
      return next(new ApiError("Not authenticated", 401)); 
    }

    const user = await User.findByPk(req.user.id, {
      attributes: ["isVerified"],
    });
    if (!user) {
      res.clearCookie("token"); 
      return next(new ApiError("User not found", 404));
    }
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { isVerified: user.isVerified },
          "Verification status fetched"
        )
      );
  } catch (error) {
    next(new ApiError("Failed to check verification status", 500)); // Pass to global error handler
  }
});

// Current Logged-in User Operations
router.get("/current", authMiddleware, getCurrentUser);
router.put("/update", authMiddleware, updateUser);
router.post("/logout", authMiddleware, logoutUser); 


router.get("/admin/all", authMiddleware, getAllUsers); 
export default router;
