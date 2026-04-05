import express from "express";
import { isAuthenticated, restrictTo } from "../middleware/auth.middleware.js";
import {
  blockUser,
  unblockUser,
  approveEntrepreneur,
  rejectEntrepreneur,
  getAllBookingsAdmin,
  getAllServicesAdmin,
  getEntrepreneurs,
  getUsers,
  getAdminDashboard,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/dashboard", getAdminDashboard)

// Protect all admin routes
router.use(isAuthenticated);
router.use(restrictTo("Admin"));

/* ================= USERS ================= */
router.get("/users", getUsers);
router.patch("/users/:id/block", blockUser);
router.patch("/users/:id/unblock", unblockUser);

/* ================= ENTREPRENEURS ================= */
router.get("/entrepreneurs", getEntrepreneurs);
router.patch("/entrepreneurs/:id/approve", approveEntrepreneur);
router.patch("/entrepreneurs/:id/reject", rejectEntrepreneur);

/* ================= BOOKINGS ================= */
router.get("/bookings", getAllBookingsAdmin);

/* ================= SERVICES ================= */
router.get("/services", getAllServicesAdmin);

export default router;
