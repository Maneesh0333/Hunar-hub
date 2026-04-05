import express from "express";
import {
  createCategory,
  getCategories,
  enableCategory,
  disableCategory,
  updateCategory,
  getAllCategories,
} from "../controllers/category.controller.js";

import {
  createCategorySchema,
  updateCategorySchema,
} from "../validations/category.validation.js";
import { isAuthenticated, restrictTo } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";


const router = express.Router();

router.get("/all", getAllCategories);

router.use(isAuthenticated);


router.use(restrictTo("Admin"));
router.get("/", getCategories);
router.post("/", validate(createCategorySchema), createCategory);

router.patch("/:id/enable", enableCategory);
router.patch("/:id/disable", disableCategory);
router.patch("/:id", validate(updateCategorySchema), updateCategory);

export default router;
