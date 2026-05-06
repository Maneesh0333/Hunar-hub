import express from "express";
import {
  getMe,
  login,
  refreshToken,
  register,
} from "../controllers/auth.controller.js";
import {
  loginSchema,
  registerSchema,
  verifyOtpSchema,
} from "../validations/auth.validation.js";
import { verifyUser } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { logout } from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.post("/verify", validate(verifyOtpSchema), verifyUser);
router.post("/refresh-token", refreshToken);
router.get("/me", isAuthenticated, getMe);

export default router;
