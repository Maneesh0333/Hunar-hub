import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    entrepreneur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Entrepreneur",
    },

    description: String,

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
    },

    status: {
      type: String,
      enum: ["Open", "In Review", "Resolved", "Escalated"],
      default: "Open",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Complaint", complaintSchema);