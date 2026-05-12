import { randomUUID } from "crypto";
import type { NextFunction, Request, Response } from "express";
import multer from "multer";
import os from "os";
import path from "path";
import { AppError } from "./errorHandler";
import {
  extensionForMime,
  MAX_UPLOAD_BYTES,
  normalizeMimeType,
  isAllowedUploadMime,
  sanitizeKeyStem,
} from "../utils/file.utils";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, os.tmpdir());
  },
  filename: (_req, file, cb) => {
    const mime = normalizeMimeType(file.mimetype);
    const stem = sanitizeKeyStem(file.originalname);
    const ext = extensionForMime(mime) || path.extname(file.originalname).toLowerCase().slice(0, 8);
    cb(null, `${randomUUID()}-${stem}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_UPLOAD_BYTES, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!isAllowedUploadMime(file.mimetype)) {
      cb(
        new AppError("Invalid file type; allowed types: PDF, JPG, PNG", 400),
      );
      return;
    }
    cb(null, true);
  },
});

/**
 * Single file upload under field name `file`.
 * Writes to OS temp dir; caller must `unlink` after S3 upload (see report controller).
 */
export function uploadReportSingle(req: Request, res: Response, next: NextFunction): void {
  upload.single("file")(req, res, (err: unknown) => {
    if (err) {
      next(err);
      return;
    }
    next();
  });
}
