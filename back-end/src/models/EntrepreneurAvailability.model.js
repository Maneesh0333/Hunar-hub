import mongoose from "mongoose";

const entrepreneurAvailabilitySchema = new mongoose.Schema(
  {
    entrepreneur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Entrepreneur",
      required: true,
      unique: true, // one document per entrepreneur
    },

    unavailableDates: [
      {
        type: String, // "YYYY-MM-DD"
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model(
  "EntrepreneurAvailability",
  entrepreneurAvailabilitySchema
);