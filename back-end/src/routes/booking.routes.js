import express from "express";
import { isAuthenticated, restrictTo } from "../middleware/auth.middleware.js";
import {
  createBooking,
  getEntrepreneurBookings,
  updateBookingStatus,
  getUserBookings,
  updateUserBookingStatus,
  updatePaymentStatus,
  getAllBookingsAdmin,
  getMyEarning,
} from "../controllers/booking.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { bookingSchema } from "../validations/booking.validation.js";
import { validateObjectId } from "../middleware/validateObjectId.middleware.js";

const router = express.Router();

router.use(isAuthenticated);

/* ================= USER ROUTES ================= */
router.post("/", restrictTo("User"), validate(bookingSchema), createBooking);
router.get("/user", restrictTo("User"), getUserBookings);
router.patch("/:id/cancel", restrictTo("User"), validateObjectId, updateUserBookingStatus);


/* ================= ENTREPRENEUR ROUTES ================= */
router.get("/entrepreneur", restrictTo("Entrepreneur"), getEntrepreneurBookings);
router.get("/earning", restrictTo("Entrepreneur"), getMyEarning);
router.patch("/:id/status", restrictTo("Entrepreneur"), validateObjectId, updateBookingStatus);
router.patch("/:id/payment/status", restrictTo("Entrepreneur"), validateObjectId, updatePaymentStatus);

/* ================= ADMIN ROUTES ================= */
router.get("/all", restrictTo("Admin"), getAllBookingsAdmin);


export default router;
