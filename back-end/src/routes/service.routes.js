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
import { createServiceSchema, updateServiceSchema } from "../validations/service.validation.js";
import { validateObjectId } from "../middleware/validateObjectId.middleware.js";

const router = express.Router();

/* PUBLIC */
router.get("/public/:id", validateObjectId, getServiceByEntrepreneurIdPublic);

router.use(isAuthenticated);

router.get("/my", restrictTo("Entrepreneur"), getMyServices);
router.post(
  "/",
  restrictTo("Entrepreneur"),
  validate(createServiceSchema),
  createService,
);

router.patch("/:id/enable", restrictTo("Entrepreneur"), validateObjectId, enableService);
router.patch("/:id/disable", restrictTo("Entrepreneur"), validateObjectId, disableService);
router.patch("/:id", restrictTo("Entrepreneur"), validate(updateServiceSchema), validateObjectId, updateService);

export default router;
