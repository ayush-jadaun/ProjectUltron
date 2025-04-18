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

    // Check if all required fields are provided
    if (
        !user_type ||
        !organization_name ||
        !contact_number ||
        !email ||
        !password ||
        !location
    ) {
        return next(new ApiError("All fields are required", 400));
    }

    const existingUser = await User.findOne({ where: { email, organization_name } });
    if (existingUser) return next(new ApiError("User already exists", 400));

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        name,
        user_type,
        organization_name,
        contact_number,
        email,
        password: hashedPassword,
        location,
        isVerified: false,
    });

    console.log(`New user registered at ${getCurrentUTCDateTime()}`);

    try {
        await sendVerificationEmailToUser(newUser);
    } catch (error) {
        return next(new ApiError("Error sending verification email", 500));
    }

    res.status(201).json(
        new ApiResponse(
            201,
            { userId: newUser.id },
            "User registered successfully. Please verify your email before logging in."
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

  const user = await User.findOne({ where: { email }, include: Role });
  if (!user) return next(new ApiError("Invalid email or password", 400));
  if (!user.isVerified)
    return next(
      new ApiError("Please verify your email before logging in", 403)
    );

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return next(new ApiError("Invalid email or password", 400));

  const roles = user.Roles.map((role) => role.role_name);
  const token = jwt.sign(
    { id: user.id, email: user.email, roles },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 60 * 60 * 1000,
  });

  console.log(`User ${email} logged in at ${getCurrentUTCDateTime()}`);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: { id: user.id, email: user.email, roles } },
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
  if (!req.user) return next(new ApiError("Not authenticated", 401));

  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ["password"] },
  });
  if (!user) return next(new ApiError("User not found", 404));

  res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { user: user.toJSON() },
          "User retrieved successfully"
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
    if (organization_name !== undefined) user.organization_name = organization_name;
    if (contact_number !== undefined) user.contact_number = contact_number;
    if (location !== undefined) user.location = location;

    await user.save();
    console.log(
        `User ${user.email} updated profile at ${getCurrentUTCDateTime()}`
    );

    res.status(200).json(
        new ApiResponse(
            200,
            { user: user.toJSON() },
            "User updated successfully"
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

  const user = await User.findOne({ where: { email } });
  if (!user) return next(new ApiError("User not found", 404));

  const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

  try {
    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      text: `Please click on the following link to reset your password: ${resetUrl}. This link will expire in 15 minutes.`,
      html: `
        <h1>Password Reset Request</h1>
        <p>Please click on the following link to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 15 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });

    console.log(
      `Password reset requested for ${email} at ${getCurrentUTCDateTime()}`
    );

    res
      .status(200)
      .json(
        new ApiResponse(200, null, "Password reset instructions sent to email")
      );
  } catch (error) {
    return next(new ApiError("Error sending reset email", 500));
  }
});

/*
==============================
       Reset Password 
==============================
*/
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { token, newPassword } = req.body;

  if (!token) return next(new ApiError("Reset token is required", 400));

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(new ApiError("Invalid or expired token", 400));
  }

  const user = await User.findByPk(decoded.id);
  if (!user) return next(new ApiError("User not found", 404));

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  console.log(
    `Password reset completed for ${user.email} at ${getCurrentUTCDateTime()}`
  );

  try {
    await sendEmail({
      to: user.email,
      subject: "Password Changed Successfully",
      text: "Your password has been changed successfully. If you did not make this change, please contact support immediately.",
      html: `
        <h1>Password Changed Successfully</h1>
        <p>Your password has been changed successfully.</p>
        <p>If you did not make this change, please contact support immediately.</p>
      `,
    });
  } catch (error) {
    console.error("Error sending confirmation email:", error);
  }

  res.status(200).json(new ApiResponse(200, null, "Password reset successful"));
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

  console.log(
    `User ${req.user.email} logged out at ${getCurrentUTCDateTime()}`
  );

  res.status(200).json(new ApiResponse(200, null, "Logged out successfully"));
});



/*
==============================
       Email Verification
==============================
*/
export const sendVerificationEmail = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ where: { email }, include: Role });
  if (!user) return next(new ApiError("User not found", 404));

  try {
    await sendVerificationEmailToUser(user);
    res
      .status(200)
      .json(new ApiResponse(200, null, "Verification email sent successfully"));
  } catch (error) {
    return next(new ApiError("Error sending verification email", 500));
  }
});

export const verifyEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.query;

  if (!token) return next(new ApiError("Verification token is required", 400));

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(new ApiError("Invalid or expired verification token", 400));
  }

  const user = await User.findByPk(decoded.id, { include: Role });
  if (!user) return next(new ApiError("User not found", 404));

  user.isVerified = true;
  await user.save();

  const roles = user.Roles.map((role) => role.role_name);
  const authToken = jwt.sign(
    { id: user.id, email: user.email, roles },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.cookie("token", authToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 60 * 60 * 1000,
  });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          isVerified: true,
          roles,
        },
      },
      "Email verified successfully. You are now logged in."
    )
  );
});

/*
==============================
       Get User By ID
==============================
*/
export const getUserById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findByPk(id, {
    attributes: { exclude: ["password"] },
  });

  if (!user) return next(new ApiError("User not found", 404));

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: { ...user.toJSON() } },
        "User fetched successfully"
      )
    );
});

const sendVerificationEmailToUser = async (user) => {
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  await sendEmail({
    to: user.email,
    subject: "Verify Your Email Address",
    text: `Please verify your email by clicking the following link: ${verificationUrl}`,
    html: `
      <h1>Email Verification</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}">Verify Email</a>
      <p>This link will expire in 1 hour.</p>
    `,
  });

  console.log(`Verification email sent to ${user.email}`);
  return token;
};

/*
==============================
       Get All Users (Admin Only)
==============================
*/

export const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.findAll({
    attributes: { exclude: ["password"] }, 
    order: [["id", "ASC"]], 
  });


  res.status(200).json(
    new ApiResponse(
      200,
      { users: users }, 
      "All users retrieved successfully"
    )
  );

});