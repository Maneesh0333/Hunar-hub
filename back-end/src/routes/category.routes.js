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
import { validateObjectId } from "../middleware/validateObjectId.middleware.js";


const router = express.Router();

// Public
router.get("/all", getAllCategories);

router.use(isAuthenticated);
router.use(restrictTo("Admin"));

router.get("/", getCategories);
router.post("/", validate(createCategorySchema), createCategory);

router.patch("/:id/enable", validateObjectId, enableCategory);
router.patch("/:id/disable", validateObjectId, disableCategory);
router.patch("/:id", validateObjectId, validate(updateCategorySchema), updateCategory);

export default router;
