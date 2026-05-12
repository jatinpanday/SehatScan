/** User-facing UI / content language */
export const PREFERRED_LANGUAGES = ["en", "hi"] as const;
export type PreferredLanguage = (typeof PREFERRED_LANGUAGES)[number];

/** Report pipeline lifecycle */
export const REPORT_STATUSES = ["uploaded", "processing", "completed", "failed"] as const;
export type ReportStatus = (typeof REPORT_STATUSES)[number];

/** OCR job state for a report */
export const OCR_STATUSES = ["pending", "processing", "completed", "failed"] as const;
export type OcrStatus = (typeof OCR_STATUSES)[number];

/** Broad category of health document (extend as product grows) */
export const HEALTH_REPORT_TYPES = [
  "lab",
  "imaging",
  "prescription",
  "discharge_summary",
  "vaccination",
  "other",
] as const;
export type HealthReportType = (typeof HEALTH_REPORT_TYPES)[number];

/** Severity hint for parsed lab-style markers */
export const ABNORMAL_SEVERITIES = [
  "normal",
  "borderline",
  "high",
  "low",
  "critical",
  "unknown",
] as const;
export type AbnormalSeverity = (typeof ABNORMAL_SEVERITIES)[number];
