import { Router } from "express";
import * as reportController from "../controllers/report.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { asyncHandler } from "../middleware/asyncHandler";
import { uploadReportSingle } from "../middleware/upload.middleware";

const router = Router();

router.get("/", requireAuth, asyncHandler(reportController.listReports));
router.get("/:reportId", requireAuth, asyncHandler(reportController.getReport));
router.post(
  "/upload",
  requireAuth,
  uploadReportSingle,
  asyncHandler(reportController.uploadReport),
);

export { router as reportRoutes };
