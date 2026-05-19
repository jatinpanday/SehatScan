import { Router } from "express";
import * as aiController from "../controllers/ai.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

router.post(
  "/analyze/:reportId",
  requireAuth,
  asyncHandler(aiController.analyze),
);

export { router as aiRoutes };
