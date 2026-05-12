import multer from "multer";

const storage = multer.diskStorage({});

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