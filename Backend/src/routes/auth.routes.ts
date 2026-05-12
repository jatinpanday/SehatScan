import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { asyncHandler } from "../middleware/asyncHandler";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.post("/signup", asyncHandler(authController.signup));
router.post("/send-otp", asyncHandler(authController.sendOtp));
router.post("/verify-otp", asyncHandler(authController.verifyOtp));
router.post("/login", asyncHandler(authController.login));
router.get("/me", requireAuth, asyncHandler(authController.me));

export { router as authRoutes };
