// ../controllers/user.controller.js
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendEmail } from "../utils/emailService.js";

import dotenv from "dotenv";
dotenv.config();

/*
=============================
        Time and Date
=============================
*/
const getCurrentUTCDateTime = () => {
  const now = new Date();
  return now.toISOString().slice(0, 19).replace("T", " ");
};

/*
=============================
        Register User
=============================
*/
export const registerUser = asyncHandler(async (req, res, next) => {
  const {
    name,
    user_type,
    organization_name,
    contact_number,
    email,
    password,
    location,
  } = req.body;

  // Refined Validation
  if (!user_type || !contact_number || !email || !password || !location) {
    return next(
      new ApiError(
        "User type, contact number, email, password, and location are required",
        400
      )
    );
  }

  // Conditional validation for organization_name based on user_type
  if (user_type === "ngo" && !organization_name) {
    return next(
      new ApiError("Organization name is required for NGO users", 400)
    );
  }
  // Ensure organization_name is null if user_type is 'normal' and it wasn't provided
  const orgName = user_type === "ngo" ? organization_name : null;
  const userName = name || null; // Handle optional name

  // Check based on email only for existing user
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser)
    return next(new ApiError("User with this email already exists", 400));

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name: userName, // Use handled name
    user_type,
    organization_name: orgName, // Use handled org name
    contact_number,
    email,
    password: hashedPassword,
    location,
    is_verified: false, // Default is set in model, but explicit is fine
  });

  console.log(`New user registered: ${email} at ${getCurrentUTCDateTime()}`);

  try {
    // Send verification email (function defined below)
    await sendVerificationEmailToUser(newUser);
  } catch (error) {
    console.error(
      "Error sending verification email during registration:",
      error
    );
  }

  res.status(201).json(
    new ApiResponse(
      201,
      { userId: newUser.id, email: newUser.email }, // Return minimal info
      "User registered successfully. Please check your email to verify your account before logging in."
    )
  );
});

/*
=============================
        Login User
=============================
*/
export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ApiError("Email and password are required", 400));
  }


  const user = await User.findOne({ where: { email } });
  if (!user) return next(new ApiError("Invalid email or password", 401)); 

  if (!user.is_verified)
    return next(
      new ApiError(
        "Please verify your email before logging in. You can request a new verification email if needed.",
        403
      ) 
    );

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return next(new ApiError("Invalid email or password", 401)); // Use 401


  const token = jwt.sign(
    { id: user.id, email: user.email, user_type: user.user_type },
    process.env.JWT_SECRET,
    { expiresIn: "1h" } 
  );

  // Set cookie options
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // Consider 'lax' for production if needed
    maxAge: 1 * 60 * 60 * 1000, // 1 hour in milliseconds
  };

  res.cookie("token", token, cookieOptions);

  console.log(`User ${email} logged in at ${getCurrentUTCDateTime()}`);


  res.status(200).json(
    new ApiResponse(
      200,
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          user_type: user.user_type,
          isVerified: user.is_verified,
          location: user.location,
          organization_name: user.organization_name,
          contact_number: user.contact_number,
        },
      },
      "Login successful"
    )
  );
});

/*
==============================
       Get Current User
==============================
*/
export const getCurrentUser = asyncHandler(async (req, res, next) => {

  if (!req.user || !req.user.id)
    return next(new ApiError("Not authenticated", 401));

  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ["password"] }, 
  });

  if (!user) {

    res.clearCookie("token"); 
    return next(new ApiError("User not found", 404));
  }

  res.status(200).json(
    new ApiResponse(
      200,

      { user: user.toJSON() },
      "Current user retrieved successfully"
    )
  );
});

/*
==============================
       Update User
==============================
*/
export const updateUser = asyncHandler(async (req, res, next) => {
  const userId = req.user.id; 
  const { name, organization_name, contact_number, location } = req.body;

  const user = await User.findByPk(userId);
  if (!user) return next(new ApiError("User not found", 404));


  if (name !== undefined) user.name = name;

  if (organization_name !== undefined)
    user.organization_name =
      user.user_type === "ngo" ? organization_name : user.organization_name; 
  if (contact_number !== undefined) user.contact_number = contact_number;
  if (location !== undefined) user.location = location;


  await user.save();
  console.log(
    `User ${user.email} updated profile at ${getCurrentUTCDateTime()}`
  );


  const updatedUser = await User.findByPk(userId, {
    attributes: { exclude: ["password"] },
  });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: updatedUser.toJSON() },
        "User profile updated successfully"
      )
    );
});

/*
==============================
       Forgot Password
==============================
*/
export const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new ApiError("Email is required", 400));

  const user = await User.findOne({ where: { email } });

  if (!user) {
    console.log(
      `Password reset requested for non-existent email: ${email} at ${getCurrentUTCDateTime()}`
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          null,
          "If an account with this email exists, password reset instructions have been sent."
        )
      );
  }


  const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {

    expiresIn: "15m", // Short expiry
  });
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`; // Ensure CLIENT_URL is correct

  try {
    await sendEmail({
      to: user.email,
      subject: "Project Ultron - Password Reset Request",
      text: `You requested a password reset for your Project Ultron account. Please click on the following link to reset your password: ${resetUrl}\n\nThis link will expire in 15 minutes.\n\nIf you didn't request this, please ignore this email.`,
      html: `
        <h1>Password Reset Request</h1>
        <p>You requested a password reset for your Project Ultron account.</p>
        <p>Please click on the following link to reset your password:</p>
        <p><a href="${resetUrl}" target="_blank">Reset Your Password</a></p>
        <p>This link will expire in <strong>15 minutes</strong>.</p>
        <hr>
        <p>If you didn't request this, please ignore this email. Your password will remain unchanged.</p>
      `,
    });

    console.log(
      `Password reset email sent to ${email} at ${getCurrentUTCDateTime()}`
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          null,
          "If an account with this email exists, password reset instructions have been sent."
        )
      );
  } catch (error) {
    console.error(`Error sending password reset email to ${email}:`, error);
    return next(
      new ApiError(
        "Error sending password reset email. Please try again later.",
        500
      )
    );
  }
});

/*
==============================
       Reset Password
==============================
*/
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return next(new ApiError("Reset token and new password are required", 400));
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {

    return next(
      new ApiError(
        "Invalid or expired password reset token. Please request a new one.",
        400
      )
    );
  }

  const user = await User.findByPk(decoded.id);
  if (!user) {
    return next(
      new ApiError("User associated with this token not found.", 404)
    );
  }


  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  console.log(
    `Password reset successfully for ${
      user.email
    } at ${getCurrentUTCDateTime()}`
  );

  try {
    await sendEmail({
      to: user.email,
      subject: "Project Ultron - Password Changed Successfully",
      text: "Your password for Project Ultron has been successfully changed. If you did not make this change, please contact support immediately.",
      html: `
        <h1>Password Changed Successfully</h1>
        <p>Your password for Project Ultron has been successfully changed.</p>
        <p>If you did not make this change, please contact our support team immediately.</p>
      `,
    });
  } catch (error) {
    console.error(
      `Error sending password change confirmation email to ${user.email}:`,
      error
    );
 
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "Password has been reset successfully. You can now log in with your new password."
      )
    );
});

/*
==============================
       Logout User
==============================
*/
export const logoutUser = asyncHandler(async (req, res, next) => {

  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  });


  const userEmail = req.user ? req.user.email : "Unknown user";
  console.log(`User ${userEmail} logged out at ${getCurrentUTCDateTime()}`);

  res.status(200).json(new ApiResponse(200, null, "Logged out successfully"));
});

/*
==============================
       Email Verification Section
==============================
*/

// Helper function to send verification email
const sendVerificationEmailToUser = async (user) => {
  const verificationToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET, 
    { expiresIn: "1d" } 
  );
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;

  await sendEmail({
    to: user.email,
    subject: "Project Ultron - Verify Your Email Address",
    text: `Welcome to Project Ultron! Please verify your email address by clicking the following link: ${verificationUrl}\n\nThis link will expire in 24 hours.\n\nIf you didn't create an account, please ignore this email.`,
    html: `
      <h1>Welcome to Project Ultron!</h1>
      <p>Thanks for signing up. Please click the button below to verify your email address:</p>
      <p style="margin: 20px 0;">
        <a href="${verificationUrl}" target="_blank" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email Address</a>
      </p>
      <p>Or copy and paste this link into your browser: ${verificationUrl}</p>
      <p>This link will expire in <strong>24 hours</strong>.</p>
      <hr>
      <p>If you didn't create an account with Project Ultron, you can safely ignore this email.</p>
    `,
  });

  console.log(
    `Verification email sent to ${user.email} at ${getCurrentUTCDateTime()}`
  );

};

export const requestVerificationEmail = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new ApiError("Email is required", 400));

  const user = await User.findOne({ where: { email } });
  if (!user) return next(new ApiError("User with this email not found", 404));

  if (user.isVerified) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "This account is already verified."));
  }

  try {
    await sendVerificationEmailToUser(user);
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          null,
          "Verification email sent successfully. Please check your inbox (and spam folder)."
        )
      );
  } catch (error) {
    console.error(`Error resending verification email to ${email}:`, error);
    return next(
      new ApiError(
        "Error sending verification email. Please try again later.",
        500
      )
    );
  }
});


export const verifyEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.query; // Get token from query parameter

  if (!token) return next(new ApiError("Verification token is missing", 400));

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(
      new ApiError(
        "Invalid or expired verification token. Please request a new one.",
        400
      )
    );
  }


  const user = await User.findByPk(decoded.id);
  if (!user) return next(new ApiError("User not found for this token", 404));


  if (user.isVerified) {
    return res.status(200).json(
      new ApiResponse(
        200,
        { alreadyVerified: true }, 
        "Email already verified. You can log in."
      )
    );

  }


  user.isVerified = true;
  await user.save();

  console.log(
    `Email verified successfully for ${
      user.email
    } at ${getCurrentUTCDateTime()}`
  );


  const loginToken = jwt.sign(
    { id: user.id, email: user.email, user_type: user.user_type },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  // Set cookie options
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 1 * 60 * 60 * 1000, // 1 hour
  };

  res.cookie("token", loginToken, cookieOptions);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          user_type: user.user_type,
          isVerified: user.isVerified,
          location: user.location,
          organization_name: user.organization_name,
          contact_number: user.contact_number,
        },
        loggedIn: true, 
      },
      "Email verified successfully. You are now logged in."
    )
  );
});

/*
==============================
       Get User By ID (Public/Admin maybe)
==============================
*/
export const getUserById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;


  if (!/^\d+$/.test(id)) {
    return next(new ApiError("Invalid user ID format", 400));
  }

  const user = await User.findByPk(id, {
    attributes: { exclude: ["password", "isVerified"] }, 
  });

  if (!user) return next(new ApiError("User not found", 404));


  res.status(200).json(
    new ApiResponse(
      200,
      {
        user: {
          id: user.id,
          name: user.name,
          user_type: user.user_type,
          organization_name: user.organization_name,
          location: user.location,
        },
      },
      "User fetched successfully"
    )
  );
});

/*
==============================
       Get All Users (Requires Admin Authorization)
==============================
*/

export const getAllUsers = asyncHandler(async (req, res, next) => {


  const users = await User.findAll({
    attributes: { exclude: ["password"] }, 
    order: [["createdAt", "DESC"]], 

  });



  res.status(200).json(
    new ApiResponse(
      200,
      {
        users: users,
      },
      "All users retrieved successfully"
    )
  );
});
