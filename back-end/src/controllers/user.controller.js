import AppError from "../utils/AppError.js";
import User from "../models/User.model.js";
import { asyncHandler } from "../middleware/async.middleware.js";

export const getProfile = asyncHandler(async (req, res) => {
  const { id } = req.user;

  const user = await User.findById(id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { id } = req.user;

  const user = await User.findById(id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const allowedFields = ["name", "email", "phone", "city"];

  // Ensure at least one field is provided
  if (!req.body || Object.keys(req.body).length === 0) {
    throw new AppError("No fields provided for update", 400);
  }

  // Update only allowed fields (safe PATCH behavior)
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  }

  try {
    await user.save();
  } catch (err) {
    // Handle duplicate email error from MongoDB
    if (err.code === 11000) {
      throw new AppError("Email already in use", 400);
    }
    throw err;
  }

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: user,
  });
});
