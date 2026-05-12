import type { Request, Response } from "express";
import { AppError } from "../middleware/errorHandler";
import { runOcrForReport } from "../ocr/ocr.service";

export async function extract(req: Request, res: Response): Promise<void> {
  const userId = req.userId;
  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }

  const reportId = req.params.reportId;
  if (!reportId) {
    throw new AppError("reportId is required", 400);
  }

  const data = await runOcrForReport(reportId, userId);

  res.json({
    success: true,
    message: "OCR completed successfully",
    data,
  });
}
