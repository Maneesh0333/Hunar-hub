import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
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
      index: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },
  },
  { timestamps: true }
);

reviewSchema.index(
  { customer: 1, booking: 1 },
  { unique: true }
);

/* ⭐ Calculate Service Rating */
reviewSchema.statics.calcServiceRatings = async function (serviceId) {
  const stats = await this.aggregate([
    { $match: { service: serviceId } },
    {
      $group: {
        _id: "$service",
        avg: { $avg: "$rating" },
        total: { $sum: 1 },
      },
    },
  ]);

  await mongoose.model("Service").findByIdAndUpdate(serviceId, {
    ratingsAverage: stats[0]?.avg || 0,
    ratingsQuantity: stats[0]?.total || 0,
  });
};

/* ⭐ Calculate Entrepreneur Rating */
reviewSchema.statics.calcEntrepreneurRatings = async function (
  entrepreneurId
) {
  const stats = await this.aggregate([
    { $match: { entrepreneur: entrepreneurId } },
    {
      $group: {
        _id: "$entrepreneur",
        avg: { $avg: "$rating" },
        total: { $sum: 1 },
      },
    },
  ]);

  await mongoose.model("Entrepreneur").findByIdAndUpdate(
    entrepreneurId,
    {
      "rating.average": stats[0]?.avg || 0,
      "rating.totalReviews": stats[0]?.total || 0,
    }
  );
};

/* 🔥 Middleware */
reviewSchema.post("save", function () {
  this.constructor.calcServiceRatings(this.service);
  this.constructor.calcEntrepreneurRatings(this.entrepreneur);
});

reviewSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await doc.constructor.calcServiceRatings(doc.service);
    await doc.constructor.calcEntrepreneurRatings(doc.entrepreneur);
  }
});

const Review = mongoose.model("Review", reviewSchema);
export default Review;