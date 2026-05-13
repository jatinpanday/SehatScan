import { Router } from "express";
import { aiRoutes } from "./ai.routes";
import { authRoutes } from "./auth.routes";
import { ocrRoutes } from "./ocr.routes";
import { reportRoutes } from "./report.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/reports", reportRoutes);
router.use("/ocr", ocrRoutes);
router.use("/ai", aiRoutes);

export { router as apiRoutes };
