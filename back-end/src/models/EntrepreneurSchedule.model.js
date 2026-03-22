import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    entrepreneur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Entrepreneur",
      required: true,
    },
    day: {
      type: String,
      required: true,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
    },
    start: {
      type: Number, // minutes from midnight
      required: true,
      min: 0,
      max: 1440, // 24*60
    },
    end: {
      type: Number, // minutes from midnight
      required: true,
      min: 0,
      max: 1440,
    },

    working: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  { timestamps: true },
);

scheduleSchema.index({ entrepreneur: 1, day: 1 }, { unique: true });

// Create validation
scheduleSchema.pre("save", function () {
  if (this.start >= this.end) {
    throw new Error("Start time must be before end time");
  }
});

const EntrepreneurSchedule = mongoose.model(
  "EntrepreneurSchedule",
  scheduleSchema,
);
export default EntrepreneurSchedule;
