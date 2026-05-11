import mongoose from "mongoose";
import AppError from "../utils/AppError.js";

export const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new AppError("Invalid ID format", 400);
  }
  next();
};
