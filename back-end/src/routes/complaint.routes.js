import express from "express";
import { isAuthenticated, restrictTo } from "../middleware/auth.middleware.js";
import {
  createComplaint,
  getComplaints,
  updateComplaintStatus,
} from "../controllers/complaint.controller.js";

const router = express.Router();

router.use(isAuthenticated);

router.post("/", restrictTo("User"), createComplaint);
router.get("/", restrictTo("Admin"), getComplaints);
router.patch("/:id/status", restrictTo("Admin"), updateComplaintStatus);

export default router;
