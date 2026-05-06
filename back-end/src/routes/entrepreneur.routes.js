import express from "express";
import {
  createReview,
  createSchedule,
  getAvailability,
  getDashboardStats,
  getEntrepreneurProfile,
  getEntrepreneurProfileById,
  getProfileCompletenessStats,
  getReviews,
  getSchedule,
  getSearchEntrepreneurProfile,
  saveAvailability,
  updateEntrepreneurProfile,
  updateSchedule,
} from "../controllers/entrepreneur.controller.js";
import { isAuthenticated, restrictTo } from "../middleware/auth.middleware.js";
import { updateEntrepreneurProfileSchema } from "../validations/entrepreneur.validation.js";
import { validate } from "../middleware/validate.middleware.js";
import { createScheduleSchema, updateScheduleSchema } from "../validations/schedule.validation.js";
import { validateObjectId } from "../middleware/validateObjectId.middleware.js";
import { reviewSchema } from "../validations/review.validation.js";

const router = express.Router();

// Public
router.get("/search/profile", getSearchEntrepreneurProfile);
router.get("/public/profile/:id", validateObjectId, getEntrepreneurProfileById);
router.get("/reviews/:id", validateObjectId, getReviews);


router.use(isAuthenticated);
router.post("/review", restrictTo("User"), validate(reviewSchema), createReview);


router.use(restrictTo("Entrepreneur"));
router.get("/dashboard", getDashboardStats);

router.get("/profile", getEntrepreneurProfile);
router.patch("/profile",validate(updateEntrepreneurProfileSchema), updateEntrepreneurProfile);

router.get("/profile/completeness", getProfileCompletenessStats);

router.get("/me/schedule", getSchedule);
router.post("/me/schedule", validate(createScheduleSchema), createSchedule);
router.patch("/me/schedule/:id", validate(updateScheduleSchema), validateObjectId, updateSchedule);

router.get("/me/availability", getAvailability);
router.post("/me/availability", saveAvailability);

export default router;