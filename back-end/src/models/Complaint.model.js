import mongoose from "mongoose";
import autoIncrement from "../utils/autoIncrement.js";

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      unique: true,
      index: true,
    },

    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    entrepreneur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Entrepreneur",
      required: true,
      index: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 500,
    },

    type: {
      type: String,
      enum: [
        "Late Service",
        "Incorrect Charges",
        "Professionalism Issue",
        "Poor Quality",
        "Other",
      ],
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: {
        values: ["Open", "In Review", "Resolved"],
        message: "Invalid status",
      },
      default: "Open",
      index: true,
    },
  },
  { timestamps: true },
);

complaintSchema.plugin(autoIncrement, {
  field: "complaintId",
  prefix: "CMP",
});

const Complaint = mongoose.model("Complaint", complaintSchema);
export default Complaint;
