import express from "express";
import { addToWishlist, checkWishlist, getProfile, getWishlist, removeFromWishlist, updateProfile } from "../controllers/user.controller.js";
import { isAuthenticated, restrictTo } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { updateProfileSchema } from "../validations/user.validation.js";

const router = express.Router();


router.use(isAuthenticated);
router.use(restrictTo("User"));


router.get("/profile", getProfile);
router.patch("/profile", validate(updateProfileSchema), updateProfile);

router.get("/wishlist", getWishlist);
router.post("/wishlist", addToWishlist);
router.delete("/wishlist/:entrepreneurId", removeFromWishlist);
router.get("/wishlist/:entrepreneurId/check", checkWishlist)

export default router;
