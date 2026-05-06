import express from "express";
import { isAuthenticated, restrictTo } from "../middleware/auth.middleware.js";
import {
  blockUser,
  unblockUser,
  approveEntrepreneur,
  rejectEntrepreneur,
  getAllServicesAdmin,
  getEntrepreneurs,
  getUsers,
  getAdminDashboard,
  deleteReview,
  getReviews,
} from "../controllers/admin.controller.js";
import { validateObjectId } from "../middleware/validateObjectId.middleware.js";

const router = express.Router();

// Protect all admin routes
router.use(isAuthenticated);
router.use(restrictTo("Admin"));

/* ================= DASHBOARD ================= */
router.get("/dashboard", getAdminDashboard);
router.get("/reviews", getReviews);
router.delete("/reviews/:id", validateObjectId, deleteReview);

/* ================= USERS ================= */
router.get("/users", getUsers);
router.patch("/users/:id/block", validateObjectId, blockUser);
router.patch("/users/:id/unblock", validateObjectId, unblockUser);

/* ================= ENTREPRENEURS ================= */
router.get("/entrepreneurs", getEntrepreneurs);
router.patch(
  "/entrepreneurs/:id/approve",
  validateObjectId,
  approveEntrepreneur,
);
router.patch("/entrepreneurs/:id/reject", validateObjectId, rejectEntrepreneur);

/* ================= SERVICES ================= */
router.get("/services", getAllServicesAdmin);

export default router;
