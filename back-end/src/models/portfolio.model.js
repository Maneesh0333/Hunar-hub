import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema(
  {
    entrepreneur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image1: {
      type: String,
      default: "",
    },
    image2: {
      type: String,
      default: "",
    },
    image3: {
      type: String,
      default: "",
    },
    image4: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const Portfolio = mongoose.model("Portfolio", portfolioSchema);
export default Portfolio;
