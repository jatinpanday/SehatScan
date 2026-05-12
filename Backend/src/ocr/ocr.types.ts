import type { OcrStatus } from "../models/constants";

export interface OcrExtractResult {
  reportId: string;
  extractedText: string;
  ocrStatus: OcrStatus;
}

export interface GoogleVisionTextResult {
  /** Raw text as returned by Vision (before cleanup) */
  rawText: string;
  /** Approximate confidence if available (0–1); optional */
  confidenceHint?: number;
}
