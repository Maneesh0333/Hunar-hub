import express from "express";
import { isAuthenticated, restrictTo } from "../middleware/auth.middleware.js";
import {
  createBooking,
  getEntrepreneurBookings,
  getAllBookings,
  updateBookingStatus,
  getUserBookings,
  updateUserBookingStatus,
  updatePaymentStatus,
} from "../controllers/booking.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { bookingSchema } from "../validations/booking.validation.js";

const router = express.Router();

router.use(isAuthenticated);


/* ================= USER ROUTES ================= */
router.post("/", restrictTo("User"), validate(bookingSchema), createBooking);
router.get("/user", restrictTo("User"), getUserBookings);
router.patch("/:id/cancel", restrictTo("User"), updateUserBookingStatus);


/* ================= ENTREPRENEUR ROUTES ================= */
router.get("/entrepreneur", restrictTo("Entrepreneur"), getEntrepreneurBookings,);
router.patch("/:id/status", restrictTo("Entrepreneur"), updateBookingStatus);
router.patch("/:id/payment/status", restrictTo("Entrepreneur"), updatePaymentStatus);

/* ================= ADMIN ROUTES ================= */
router.get("/all", restrictTo("Admin"), getAllBookings);


export default router;
