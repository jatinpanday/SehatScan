import { Router } from "express";
import * as ocrController from "../controllers/ocr.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

router.post(
  "/extract/:reportId",
  requireAuth,
  asyncHandler(ocrController.extract),
);

export { router as ocrRoutes };
