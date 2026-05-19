import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { requireAuth } from "../middleware/auth.middleware";
import * as translationController from "./translation.controller";

const router = Router();

router.post(
  "/:reportId",
  requireAuth,
  asyncHandler(translationController.translate),
);

export { router as translationRoutes };
