import express from "express";
import { isAuthenticated, restrictTo } from "../middleware/auth.middleware.js";
import {
  createBooking,
  getMyBookings,
  getEntrepreneurBookings,
  getAllBookings,
  getBookingById,
  cancelBooking,
  updateBookingStatus,
} from "../controllers/booking.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { bookingSchema } from "../validations/booking.validation.js";

const router = express.Router();

router.use(isAuthenticated);


/* ================= USER ROUTES ================= */
router.post("/", restrictTo("User"), validate(bookingSchema), createBooking);
router.get("/my", restrictTo("User"), getMyBookings);
router.patch("/:id/cancel", restrictTo("User", "Admin"), cancelBooking);


/* ================= ENTREPRENEUR ROUTES ================= */
router.get("/entrepreneur", restrictTo("Entrepreneur"), getEntrepreneurBookings,);
router.patch("/:id/status", restrictTo("Entrepreneur"), updateBookingStatus);


/* ================= ADMIN ROUTES ================= */
router.get("/all", restrictTo("Admin"), getAllBookings);


/* ================= SHARED ROUTE ================= */
router.get("/:id", getBookingById);

export default router;
