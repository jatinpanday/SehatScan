import fs from "fs/promises";
import path from "path";
import { AppError } from "../middleware/errorHandler";

/** 10MB — aligns with Multer `limits.fileSize` */
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

const ALLOWED_NORMALIZED_MIMES = new Set(["application/pdf", "image/jpeg", "image/png"]);

/**
 * Multer / browsers may send `image/jpg`; normalize for storage and S3 `ContentType`.
 */
export function normalizeMimeType(mime: string): string {
  const m = mime.toLowerCase().trim();
  if (m === "image/jpg") return "image/jpeg";
  return m;
}

export function isAllowedUploadMime(mime: string): boolean {
  return ALLOWED_NORMALIZED_MIMES.has(normalizeMimeType(mime));
}

/** Safe fragment for S3 key stem (no path separators, no odd chars). */
export function sanitizeKeyStem(originalName: string): string {
  const base = path.basename(originalName);
  const withoutExt = base.replace(/\.[^/.]+$/, "");
  const cleaned = withoutExt
    .replace(/[^a-zA-Z0-9._-]+/g, "_")
    .replace(/^\.+/, "")
    .slice(0, 80);
  return cleaned.length > 0 ? cleaned : "file";
}

/**
 * Preserves extension; strips control chars and path traversal for stored `originalFileName`.
 */
export function sanitizeOriginalFileName(originalName: string): string {
  const base = path.basename(originalName);
  const safe = base
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/[\\/]+/g, "_")
    .replace(/\.\.+/g, ".")
    .trim()
    .slice(0, 500);
  return safe.length > 0 ? safe : "report";
}

export function extensionForMime(mime: string): string {
  switch (normalizeMimeType(mime)) {
    case "application/pdf":
      return ".pdf";
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    default:
      return "";
  }
}

/**
 * Confirms on-disk content matches allowed types (MIME can be spoofed).
 */
export async function assertFileMagicBytes(filePath: string, claimedMime: string): Promise<void> {
  const mime = normalizeMimeType(claimedMime);
  const fh = await fs.open(filePath, "r");
  try {
    const buf = Buffer.alloc(12);
    const { bytesRead } = await fh.read(buf, 0, 12, 0);
    if (bytesRead < 4) {
      throw new AppError("Invalid or empty file", 400);
    }

    const isPdf =
      buf[0] === 0x25 && buf[1] === 0x50 && buf[2] === 0x44 && buf[3] === 0x46; // %PDF
    const isJpeg = buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
    const isPng =
      buf[0] === 0x89 &&
      buf[1] === 0x50 &&
      buf[2] === 0x4e &&
      buf[3] === 0x47 &&
      buf[4] === 0x0d &&
      buf[5] === 0x0a &&
      buf[6] === 0x1a &&
      buf[7] === 0x0a;

    const ok =
      (mime === "application/pdf" && isPdf) ||
      (mime === "image/jpeg" && isJpeg) ||
      (mime === "image/png" && isPng);

    if (!ok) {
      throw new AppError("File content does not match declared type (PDF, JPG, or PNG only)", 400);
    }
  } finally {
    await fh.close();
  }
}
