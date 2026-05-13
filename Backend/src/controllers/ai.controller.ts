import type { Request, Response } from "express";
import { AppError } from "../middleware/errorHandler";
import { runAiAnalysisForReport } from "../services/reportAiAnalysis.service";

export async function analyze(req: Request, res: Response): Promise<void> {
  const userId = req.userId;
  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }

  const reportId = req.params.reportId;
  if (!reportId) {
    throw new AppError("reportId is required", 400);
  }

  const { reportId: rid, analysis } = await runAiAnalysisForReport(reportId, userId);

  res.json({
    success: true,
    message: "AI analysis completed successfully",
    data: {
      reportId: rid,
      analysis: {
        summary: analysis.summary,
        keyFindings: analysis.keyFindings,
        abnormalValues: analysis.abnormalValues,
        precautions: analysis.precautions,
        possibleConcerns: analysis.possibleConcerns,
        lifestyleSuggestions: analysis.lifestyleSuggestions,
        questionsForDoctor: analysis.questionsForDoctor,
        disclaimer: analysis.disclaimer,
      },
    },
  });
}
