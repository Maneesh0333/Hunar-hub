import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    entrepreneur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Entrepreneur",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    priceUnit: {
      type: String,
      enum: ["per_piece", "per_hour", "per_service"],
      default: "per_service",
    },

    deliveryTime: {
      type: String,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

serviceSchema.index({ entrepreneur: 1, title: 1 }, { unique: true });

serviceSchema.index({
  title: "text",
  description: "text",
});

serviceSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    delete ret.updatedAt;
    return ret;
  },
});

const Service = mongoose.model("Service", serviceSchema);

export default Service;
