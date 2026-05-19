import { randomUUID } from "crypto";
import fs from "fs/promises";
import type { Request, Response } from "express";
import { Types } from "mongoose";
import { AppError } from "../middleware/errorHandler";
import {
  HEALTH_REPORT_TYPES,
  PREFERRED_LANGUAGES,
  type HealthReportType,
  type PreferredLanguage,
} from "../models/constants";
import { isProduction } from "../config/env";
import { Analysis, type IAnalysisDocument } from "../models/analysis.model";
import type { IReport, IReportDocument } from "../models/report.model";
import { Report } from "../models/report.model";
import * as s3 from "../services/s3.service";
import {
  assertFileMagicBytes,
  extensionForMime,
  normalizeMimeType,
  sanitizeOriginalFileName,
} from "../utils/file.utils";

function parseReportType(raw: unknown): HealthReportType {
  if (raw === undefined || raw === null || String(raw).trim() === "") {
    return "other";
  }
  const v = String(raw).trim();
  if (!(HEALTH_REPORT_TYPES as readonly string[]).includes(v)) {
    throw new AppError("Invalid reportType", 400);
  }
  return v as HealthReportType;
}

function parseLanguage(raw: unknown): PreferredLanguage {
  if (raw === undefined || raw === null || String(raw).trim() === "") {
    return "en";
  }
  const v = String(raw).trim();
  if (!(PREFERRED_LANGUAGES as readonly string[]).includes(v)) {
    throw new AppError('Invalid language; use "en" or "hi"', 400);
  }
  return v as PreferredLanguage;
}

function computedReportStatus(
  report: Pick<IReport, "status" | "ocrStatus">,
  analysis?: Pick<IAnalysisDocument, "analysisStatus"> | null,
) {
  if (analysis?.analysisStatus === "completed") {
    return "completed";
  }
  if (analysis?.analysisStatus === "failed" || report.ocrStatus === "failed" || report.status === "failed") {
    return "failed";
  }
  if (analysis?.analysisStatus === "processing" || report.ocrStatus === "processing" || report.status === "processing") {
    return "processing";
  }
  return report.status;
}

function serializeAnalysis(analysis?: IAnalysisDocument | null) {
  if (!analysis) {
    return null;
  }

  return {
    id: String(analysis._id),
    status: analysis.analysisStatus,
    generatedAt: analysis.generatedAt?.toISOString() ?? null,
    summary: analysis.summary,
    keyFindings: analysis.keyFindings,
    abnormalValues: analysis.abnormalValues.map((item) => ({
      markerName: item.markerName,
      observedValue: item.observedValue,
      unit: item.unit,
      referenceRange: item.referenceRange,
      severity: item.severity,
    })),
    possibleConcerns: analysis.possibleConcerns,
    lifestyleSuggestions: analysis.lifestyleSuggestions,
    precautions: analysis.precautions,
    questionsForDoctor: analysis.questionsForDoctor,
    disclaimer: analysis.disclaimer,
  };
}

function serializeReport(report: IReportDocument, analysis?: IAnalysisDocument | null, fileUrl?: string) {
  return {
    id: String(report._id),
    originalFileName: report.originalFileName,
    fileUrl,
    fileType: report.fileType,
    reportType: report.reportType,
    status: computedReportStatus(report, analysis),
    ocrStatus: report.ocrStatus,
    analysisStatus: analysis?.analysisStatus ?? null,
    hasAnalysis: analysis?.analysisStatus === "completed",
    language: report.language,
    uploadedAt: report.createdAt.toISOString(),
    updatedAt: report.updatedAt.toISOString(),
    processedAt: report.processedAt?.toISOString() ?? null,
    analysis: serializeAnalysis(analysis),
  };
}

export async function listReports(req: Request, res: Response): Promise<void> {
  const userId = req.userId;
  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }

  const reports = await Report.find({ userId: new Types.ObjectId(userId) })
    .sort({ createdAt: -1 })
    .limit(100)
    .exec();

  const reportIds = reports.map((report) => report._id);
  const analyses = await Analysis.find({ reportId: { $in: reportIds } }).exec();
  const analysisByReportId = new Map(analyses.map((analysis) => [String(analysis.reportId), analysis]));
  const serializedReports = await Promise.all(
    reports.map(async (report) => {
      let fileUrl: string | undefined;
      try {
        fileUrl = await s3.getPresignedDownloadUrl(report.fileUrl);
      } catch (err) {
        console.error("S3 presign failed for report list item:", err);
      }
      return serializeReport(report, analysisByReportId.get(String(report._id)), fileUrl);
    }),
  );

  res.json({
    success: true,
    data: serializedReports,
  });
}

export async function getReport(req: Request, res: Response): Promise<void> {
  const userId = req.userId;
  const reportId = req.params.reportId;
  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }
  if (!Types.ObjectId.isValid(reportId)) {
    throw new AppError("Invalid report id", 400);
  }

  const report = await Report.findOne({
    _id: new Types.ObjectId(reportId),
    userId: new Types.ObjectId(userId),
  }).exec();

  if (!report) {
    throw new AppError("Report not found", 404);
  }

  const analysis = await Analysis.findOne({ reportId: report._id }).exec();
  let fileUrl: string | undefined;
  try {
    fileUrl = await s3.getPresignedDownloadUrl(report.fileUrl);
  } catch (err) {
    console.error("S3 presign failed for report detail:", err);
  }

  res.json({
    success: true,
    data: serializeReport(report, analysis, fileUrl),
  });
}

/**
 * POST multipart: `file` (binary), optional `reportType`, optional `language`.
 * Persists `fileUrl` as the **S3 object key**; response `fileUrl` is a presigned GET URL.
 */
export async function uploadReport(req: Request, res: Response): Promise<void> {
  const userId = req.userId;
  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }

  if (!req.file) {
    throw new AppError('No file uploaded; send multipart field "file"', 400);
  }

  const mime = normalizeMimeType(req.file.mimetype);
  await assertFileMagicBytes(req.file.path, mime);

  const reportType = parseReportType(req.body.reportType);
  const language = parseLanguage(req.body.language);

  const ext = extensionForMime(mime) || "";
  const key = `reports/${userId}/${randomUUID()}${ext}`;

  try {
    try {
      await s3.uploadFileFromPath({
        localPath: req.file.path,
        key,
        contentType: mime,
      });
    } catch (err) {
      console.error("S3 upload failed:", err);
      const detail = s3.getS3ErrorDetail(err);
      if (!isProduction) {
        throw new AppError(
          `File storage failed: ${detail}. Check AWS_REGION matches the bucket region, IAM has s3:PutObject on this bucket, and the bucket name is correct.`,
          502,
        );
      }
      throw new AppError("File storage failed; please try again later", 502);
    }

    let report;
    try {
      report = await Report.create({
        userId: new Types.ObjectId(userId),
        originalFileName: sanitizeOriginalFileName(req.file.originalname),
        fileUrl: key,
        fileType: mime,
        reportType,
        extractedText: "",
        ocrStatus: "pending",
        processedAt: null,
        analysis: null,
        language,
        status: "uploaded",
      });
    } catch (dbErr) {
      await s3.deleteObjectByKey(key).catch((e) => {
        console.error("S3 rollback after DB failure:", e);
      });
      throw dbErr;
    }

    let fileUrl: string;
    try {
      fileUrl = await s3.getPresignedDownloadUrl(key);
    } catch (err) {
      console.error("S3 presign failed:", err);
      await Report.findByIdAndDelete(report._id).catch(() => undefined);
      await s3.deleteObjectByKey(key).catch((e) => console.error("S3 rollback after presign failure:", e));
      const detail = s3.getS3ErrorDetail(err);
      if (!isProduction) {
        throw new AppError(`Could not generate download link: ${detail}`, 502);
      }
      throw new AppError("Could not generate download link; please try again later", 502);
    }

    res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      data: {
        reportId: String(report._id),
        fileUrl,
        fileType: mime,
        status: "uploaded",
      },
    });
  } finally {
    await fs.unlink(req.file.path).catch(() => undefined);
  }
}
