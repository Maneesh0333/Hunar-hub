import mongoose from "mongoose";
import autoIncrement from "../utils/autoIncrement.js";

const categorySchema = new mongoose.Schema(
  {
    categoryId: {
      type: String,
      unique: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 30,
    },

    icon: {
      type: String,
      trim: true,
      required: [true, "Please provide an icon"],
      minlength: 1,
      maxlength: 20, 
    },

    description: {
      type: String,
      default: "",
      maxlength: 100,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true },
);

categorySchema.index(
  { name: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } },
);

categorySchema.index({ status: 1, createdAt: -1 });

categorySchema.plugin(autoIncrement, {
  field: "categoryId",
  prefix: "CAT",
});

const Category = mongoose.model("Category", categorySchema);
export default Category;
