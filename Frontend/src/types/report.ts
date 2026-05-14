export type ReportType = "lab" | "imaging" | "prescription" | "discharge_summary" | "vaccination" | "other";
export type ReportStatus = "uploaded" | "processing" | "completed" | "failed";
export type OcrStatus = "pending" | "processing" | "completed" | "failed";
export type AnalysisStatus = "pending" | "processing" | "completed" | "failed";

export interface Report {
  id: string;
  originalFileName: string;
  fileUrl?: string;
  fileType: string;
  reportType: ReportType;
  status: ReportStatus;
  ocrStatus: OcrStatus;
  analysisStatus: AnalysisStatus | null;
  hasAnalysis: boolean;
  language: "en" | "hi";
  uploadedAt: string;
  updatedAt: string;
  processedAt: string | null;
  analysis: StoredAnalysis | null;
}

export interface UploadReportResponse {
  reportId: string;
  fileUrl: string;
  fileType: string;
  status: ReportStatus;
}

export interface AnalysisFinding {
  label: string;
  value: string;
  status: "normal" | "attention" | "critical";
}

export interface ReportAnalysis {
  reportId: string;
  summary: string;
  findings: AnalysisFinding[];
  recommendations: string[];
  generatedAt: string | null;
  disclaimer?: string;
}

export interface StoredAbnormalValue {
  markerName?: string;
  observedValue?: string;
  unit?: string;
  referenceRange?: string;
  severity: "normal" | "borderline" | "high" | "low" | "critical" | "unknown";
}

export interface StoredAnalysis {
  id: string;
  status: AnalysisStatus;
  generatedAt: string | null;
  summary: string;
  keyFindings: string[];
  abnormalValues: StoredAbnormalValue[];
  possibleConcerns: string[];
  lifestyleSuggestions: string[];
  precautions: string[];
  questionsForDoctor: string[];
  disclaimer: string;
}

export interface AnalyzeReportResponse {
  reportId: string;
  analysis: Omit<StoredAnalysis, "id" | "status" | "generatedAt">;
}
