import type { Request, Response } from "express";
import { AppError } from "../middleware/errorHandler";
import { translateAnalysis } from "./translation.service";
import type { TranslationRequestBody } from "./translation.types";
import { assertTranslationLanguage } from "./translation.validator";

export async function translate(req: Request, res: Response): Promise<void> {
  const userId = req.userId;
  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }

  const reportId = req.params.reportId;
  if (!reportId) {
    throw new AppError("reportId is required", 400);
  }

  const body = req.body as TranslationRequestBody;
  const language = assertTranslationLanguage(body.language);
  const data = await translateAnalysis({ reportId, userId, language });

  res.json({
    success: true,
    message: data.cached
      ? "Translation loaded from cache"
      : "Translation completed successfully",
    data,
  });
}
