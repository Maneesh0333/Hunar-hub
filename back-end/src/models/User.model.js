import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 30,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    city: {
      type: String,
      trim: true,
      default: ""
    },

    role: {
      type: String,
      enum: ["User", "Entrepreneur", "Admin"],
      default: "User",
    },

    signupAs: {
      type: String,
      enum: ["User", "Entrepreneur"],
      default: "User",
    },

    status: {
      type: String,
      enum: ["Active", "Blocked"],
      default: "Active",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    emailVerifyOtp: {
      type: String,
      default: null,
      select: false,
    },

    emailVerifyExpires: {
      type: Date,
      default: null,
      select: false,
    },
  },
  { timestamps: true },
);

userSchema.index({ status: 1 });

const User = mongoose.model("User", userSchema);
export default User;
