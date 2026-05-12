import pdfParse from "pdf-parse";
import { Types } from "mongoose";
import { isProduction } from "../config/env";
import { AppError } from "../middleware/errorHandler";
import { Report } from "../models/report.model";
import { getObjectBufferByKey } from "../services/s3.service";
import { normalizeMimeType } from "../utils/file.utils";
import { documentTextDetectionFromBuffer } from "./googleVision.service";
import { cleanOcrText, MIN_PDF_EMBEDDED_TEXT_LENGTH } from "./ocr.utils";
import type { OcrExtractResult } from "./ocr.types";
import type { IReportDocument } from "../models/report.model";

async function extractPdfEmbeddedText(buffer: Buffer): Promise<string> {
  const data = await pdfParse(buffer);
  return (data.text ?? "").trim();
}

function isImageMime(mime: string): boolean {
  const m = normalizeMimeType(mime);
  return m === "image/jpeg" || m === "image/png" || m === "image/jpg";
}

async function failJob(report: IReportDocument, message: string, code: number): Promise<never> {
  report.ocrStatus = "failed";
  report.processedAt = new Date();
  await report.save();
  throw new AppError(message, code);
}

export async function runOcrForReport(
  reportId: string,
  userId: string,
): Promise<OcrExtractResult> {
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

  if (report.ocrStatus === "processing") {
    throw new AppError("OCR is already running for this report", 409);
  }

  report.ocrStatus = "processing";
  await report.save();

  try {
    const buffer = await getObjectBufferByKey(report.fileUrl);
    const mime = normalizeMimeType(report.fileType);

    let raw = "";

    if (mime === "application/pdf") {
      raw = await extractPdfEmbeddedText(buffer);
      if (raw.length < MIN_PDF_EMBEDDED_TEXT_LENGTH) {
        await failJob(
          report,
          "Little or no selectable text in this PDF. It may be a scanned document. Google Vision synchronous OCR supports images; for scanned PDFs use image exports, Google Document AI, or async Vision with a GCS URI.",
          422,
        );
      }
    } else if (isImageMime(mime)) {
      const visionResult = await documentTextDetectionFromBuffer(buffer);
      raw = visionResult.rawText;
    } else {
      await failJob(report, `Unsupported file type for OCR: ${mime}`, 400);
    }

    const extractedText = cleanOcrText(raw);

    if (extractedText.length < 2) {
      await failJob(
        report,
        "No readable text could be extracted (empty after cleanup)",
        422,
      );
    }

    report.extractedText = extractedText;
    report.ocrStatus = "completed";
    report.processedAt = new Date();
    await report.save();

    return {
      reportId: String(report._id),
      extractedText,
      ocrStatus: "completed",
    };
  } catch (err) {
    if (report.ocrStatus === "processing") {
      report.ocrStatus = "failed";
      report.processedAt = new Date();
      await report.save().catch(() => undefined);
    }

    if (err instanceof AppError) {
      throw err;
    }

    console.error("OCR pipeline error:", err);
    const msg = err instanceof Error ? err.message : String(err);
    if (!isProduction) {
      throw new AppError(`OCR processing failed: ${msg}`, 502);
    }
    throw new AppError("OCR processing failed", 502);
  }
}
