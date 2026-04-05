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
  getReviewStats,
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

const router = express.Router();

// Public
router.get("/search/profile", getSearchEntrepreneurProfile);
router.get("/public/profile/:id", getEntrepreneurProfileById);

router.get("/reviews/:id", getReviews);
router.get("/stats/:id", getReviewStats);


router.use(isAuthenticated);
router.post("/review", restrictTo("User"), createReview);


router.use(restrictTo("Entrepreneur"));
router.get("/dashboard", getDashboardStats);

router.get("/profile", getEntrepreneurProfile);
router.patch("/profile",validate(updateEntrepreneurProfileSchema), updateEntrepreneurProfile);

router.get("/profile/completeness", getProfileCompletenessStats);

router.get("/me/schedule", getSchedule);
router.post("/me/schedule", validate(createScheduleSchema), createSchedule);
router.patch("/me/schedule/:id", validate(updateScheduleSchema), updateSchedule);

router.get("/me/availability", getAvailability);
router.post("/me/availability", saveAvailability);

export default router;