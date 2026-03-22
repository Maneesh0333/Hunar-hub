import express from "express";
import { getProfile, updateProfile } from "../controllers/user.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { updateProfileSchema } from "../validations/user.validation.js";

const router = express.Router();

// Protect all routes
router.use(isAuthenticated);

// Get logged-in user profile
router.get("/profile", getProfile);

router.patch("/profile", validate(updateProfileSchema), updateProfile);

export default router;
