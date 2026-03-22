import express from "express";
import { isAuthenticated, restrictTo } from "../middleware/auth.middleware.js";
import {
  createService,
  getMyServices,
  updateService,
  enableService,
  disableService,
  getServiceByEntrepreneurIdPublic,
} from "../controllers/service.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { createServiceSchema } from "../validations/service.validation.js";

const router = express.Router();

/* PUBLIC */
router.get("/public/:id", getServiceByEntrepreneurIdPublic);

router.use(isAuthenticated);

router.get("/my", restrictTo("Entrepreneur"), getMyServices);
router.post(
  "/",
  restrictTo("Entrepreneur"),
  validate(createServiceSchema),
  createService,
);

router.patch("/:id/enable", restrictTo("Entrepreneur"), enableService);

router.patch("/:id/disable", restrictTo("Entrepreneur"), disableService);

router.patch("/:id", restrictTo("Entrepreneur"), updateService);

export default router;
