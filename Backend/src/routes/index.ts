import { Router } from "express";
import { authRoutes } from "./auth.routes";
import { ocrRoutes } from "./ocr.routes";
import { reportRoutes } from "./report.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/reports", reportRoutes);
router.use("/ocr", ocrRoutes);

export { router as apiRoutes };
