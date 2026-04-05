import { asyncHandler } from "../middleware/async.middleware.js";
import Entrepreneur from "../models/Entrepreneur.model.js";
import User from "../models/User.model.js";
import AppError from "../utils/AppError.js";
import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";
import crypto from "crypto";
import Session from "../models/Session.model.js";
import verifyMail from "../services/verifyMail.js"

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, signupAs } = req.body;

  // Check user already exist
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("Email already registered", 400);
  }

  // Hash Password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create verification OTP
  const rawOtp = crypto.randomInt(100000, 1000000).toString();
  const hashedOtp = crypto.createHash("sha256").update(rawOtp).digest("hex");

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
    role: "User",
    signupAs,
    emailVerifyOtp: hashedOtp,
    emailVerifyExpires: Date.now() + 10 * 60 * 1000,
  });

  if (signupAs === "Entrepreneur") {
    await Entrepreneur.create({
      user: user._id,
      verificationStatus: "Pending",
    });
  }

  await verifyMail(email, rawOtp);

  return res.status(201).json({
    success: true,
    message: "Registration successful. Please verify your email.",
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  if (user.status === "Blocked") {
    throw new AppError("Your account has been blocked", 403);
  }

  // Check if email verified
  if (!user.isVerified) {
    // Create verification token
    const rawOtp = crypto.randomInt(100000, 1000000).toString();
    const hashedOtp = crypto.createHash("sha256").update(rawOtp).digest("hex");

    user.emailVerifyOtp = hashedOtp;
    user.emailVerifyExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await verifyMail(email, rawOtp);

    return res.status(403).json({
      success: false,
      message: "Email not verified. OTP sent again.",
      requiresVerification: true,
    });
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);

  console.log(isMatch, "-----")
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  if (user.signupAs === "Entrepreneur") {
    const entrepreneur = await Entrepreneur.findOne({ user: user._id });

    if (!entrepreneur) {
      throw new AppError("Entrepreneur profile not found", 500);
    }

    if (entrepreneur.verificationStatus === "Pending") {
      return res.status(403).json({
        success: false,
        message: "Your entrepreneur account is under review",
        entrepreneurStatus: "Pending",
      });
    }

    if (entrepreneur.verificationStatus === "Rejected") {
      return res.status(403).json({
        success: false,
        message: "Your entrepreneur request was rejected",
        entrepreneurStatus: "Rejected",
      });
    }
  }

  // Create tokens
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" },
  );

  const refreshToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" },
  );

  const hashedRefreshToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  // Store refresh token in DB (one session per login)
  await Session.create({
    userId: user._id,
    refreshToken: hashedRefreshToken,
  });

  // Send refresh token as HTTP-only cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // Fillter User

  const fillteredUser = {}
  fillteredUser.id = user._id;
  fillteredUser.name = user.name;
  fillteredUser.email = user.email
  fillteredUser.phone = user.phone
  fillteredUser.role = user.role

  // Send access token in response body
  res.status(200).json({
    success: true,
    message: `Welcome back ${user.name}`,
    data: {
      accessToken,
      user: fillteredUser,
      id: user._id
    }
  });
});

export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    const hashedRefreshToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    await Session.deleteOne({ refreshToken: hashedRefreshToken });
  }

  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

export const verifyUser = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  const user = await User.findOne({
    email,
    emailVerifyOtp: hashedOtp,
    emailVerifyExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError("Invalid or expired OTP", 400);
  }

  user.isVerified = true;
  user.emailVerifyOtp = undefined;
  user.emailVerifyExpires = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Email verified successfully",
  });
});

export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new AppError("Unauthorized", 401);
  }

  let decoded;

  // 1️⃣ Verify token signature & expiry
  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  // 2️⃣ Check if token exists in DB
  const hashedToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const session = await Session.findOne({
    userId: decoded.id,
    refreshToken: hashedToken,
  });

  // 🚨 Token reuse detection
  if (!session) {
    // Delete all sessions for that user
    await Session.deleteMany({ userId: decoded.id });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
    });

    throw new AppError("Session reuse detected. Please login again.", 401);
  }

  await Session.deleteOne({ refreshToken: hashedToken });

  // 3️⃣ Generate new tokens
  const newAccessToken = jwt.sign(
    { id: decoded.id, role: decoded.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" },
  );

  const newRefreshToken = jwt.sign(
    { id: decoded.id, role: decoded.role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" },
  );

  const hashedRefreshToken = crypto
    .createHash("sha256")
    .update(newRefreshToken)
    .digest("hex");

  // create a new session
  await Session.create({
    userId: decoded.id,
    refreshToken: hashedRefreshToken,
  });

  // 5️⃣ Send new refresh token cookie
  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // 6️⃣ Send new access token
  res.status(200).json({
    success: true,
    accessToken: newAccessToken,
  });
});
