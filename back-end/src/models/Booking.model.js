import mongoose from "mongoose";
import autoIncrement from "../utils/autoIncrement.js";

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      unique: true,
      index: true,
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

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    visitType: {
      type: String,
      enum: ["visit_home", "visit_workshop"],
      default: "visit_workshop",
    },

    requirements: {
      type: String,
      trim: true,
      maxlength: 300,
      default: ""
    },

    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Declined", "Completed", "Cancelled"],
      default: "Pending",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },
  },
  { timestamps: true },
);

bookingSchema.index({ entrepreneur: 1, status: 1 });

bookingSchema.plugin(autoIncrement, {
  field: "bookingId",
  prefix: "BOOK",
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
