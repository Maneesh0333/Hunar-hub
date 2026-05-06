import express from "express";
import { isAuthenticated, restrictTo } from "../middleware/auth.middleware.js";
import {
  createComplaint,
  getComplaints,
  updateComplaintStatus,
} from "../controllers/complaint.controller.js";
import { validateObjectId } from "../middleware/validateObjectId.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { complaintSchema } from "../validations/complaint.validation.js";

const router = express.Router();

router.use(isAuthenticated);

router.post("/", restrictTo("User"), validate(complaintSchema), createComplaint);
router.get("/", restrictTo("Admin"), getComplaints);
router.patch("/:id/status", restrictTo("Admin"), validateObjectId, updateComplaintStatus);

export default router;
