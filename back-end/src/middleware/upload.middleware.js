import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => ({
    folder: "portfolio",

    allowed_formats: ["jpg", "jpeg", "png", "webp", "avif"],

    public_id: Date.now() + "-" + file.originalname.split(".")[0],
  }),
});

export const uploadPortfolioImages = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
}).fields([
  { name: "image1", maxCount: 1 },
  { name: "image2", maxCount: 1 },
  { name: "image3", maxCount: 1 },
  { name: "image4", maxCount: 1 },
]);
