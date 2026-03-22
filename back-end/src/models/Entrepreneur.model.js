import mongoose from "mongoose";

const entrepreneurSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    bio: {
      type: String,
      default: "",
      maxlength: 30,
      trim: true,
    },

    about: {
      type: String,
      maxlength: 300,
      default: "",
      trim: true,
    },

    skills: {
      type: [String],
      default: [],
      validate: [(arr) => arr.length <= 20, "Max 20 skills allowed"],
    },

    payment: {
      type: [
        {
          type: String,
          enum: ["Cash", "UPI", "Card", "Bank Transfer"],
        },
      ],
      default: [],
      validate: [
        (arr) => arr.length <= 5,
        "Max 5 payment methods",
        (arr) => new Set(arr).size === arr.length,
        "Duplicate payment methods not allowed",
      ],
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    experienceYears: {
      type: Number,
      default: 0,
      min: 0,
      max: 60,
    },

    // ⭐ Ratings (cached for fast UI)
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      totalReviews: {
        type: Number,
        default: 0,
        min: 0,
      },
    },

    // 📦 Business Stats
    totalOrders: {
      type: Number,
      default: 0,
    },

    completedOrders: {
      type: Number,
      default: 0,
    },

    // 🧾 Verification
    verificationStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    // 🚦 Account Status
    isActive: {
      type: Boolean,
      default: true,
    },

    languages: {
      type: [String],
      default: [],
      validate: [
        (arr) => arr.length <= 10,
        "Max 10 languages allowed",
        (arr) => new Set(arr).size === arr.length,
        "Duplicate languages not allowed",
      ],
    },
  },
  { timestamps: true },
);

const Entrepreneur = mongoose.model("Entrepreneur", entrepreneurSchema);
export default Entrepreneur;
