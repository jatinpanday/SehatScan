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
