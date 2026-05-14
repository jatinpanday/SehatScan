import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/constants/api";
import type { ApiResponse } from "@/types/api";
import type { PreferredLanguage } from "@/types/auth";
import type {
  AnalyzeReportResponse,
  Report,
  ReportAnalysis,
  ReportType,
  StoredAnalysis,
  UploadReportResponse,
} from "@/types/report";

export interface UploadReportPayload {
  file: File;
  reportType: ReportType;
  language: PreferredLanguage;
}

function severityToStatus(severity?: string) {
  if (severity === "critical") {
    return "critical" as const;
  }
  if (severity === "high" || severity === "low" || severity === "borderline") {
    return "attention" as const;
  }
  return "normal" as const;
}

function storedAnalysisToView(reportId: string, analysis: StoredAnalysis): ReportAnalysis {
  return {
    reportId,
    summary: analysis.summary,
    generatedAt: analysis.generatedAt,
    findings: [
      ...analysis.abnormalValues.map((item) => ({
        label: item.markerName ?? "Health marker",
        value: [item.observedValue, item.unit, item.referenceRange ? `Reference: ${item.referenceRange}` : undefined]
          .filter(Boolean)
          .join(" · "),
        status: severityToStatus(item.severity),
      })),
      ...analysis.keyFindings.map((finding) => ({
        label: "Key finding",
        value: finding,
        status: "normal" as const,
      })),
    ],
    recommendations: [
      ...analysis.precautions,
      ...analysis.lifestyleSuggestions,
      ...analysis.questionsForDoctor.map((question) => `Ask your doctor: ${question}`),
    ],
    disclaimer: analysis.disclaimer,
  };
}

function analyzeResponseToView(response: AnalyzeReportResponse): ReportAnalysis {
  return storedAnalysisToView(response.reportId, {
    id: response.reportId,
    status: "completed",
    generatedAt: new Date().toISOString(),
    ...response.analysis,
  });
}

export const reportService = {
  async uploadReport(payload: UploadReportPayload) {
    const formData = new FormData();
    formData.append("file", payload.file);
    formData.append("reportType", payload.reportType);
    formData.append("language", payload.language);

    const { data } = await apiClient.post<ApiResponse<UploadReportResponse>>(
      API_ENDPOINTS.reports.upload,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return data.data;
  },

  async getReports() {
    const { data } = await apiClient.get<ApiResponse<Report[]>>(API_ENDPOINTS.reports.history);
    return data.data;
  },

  async getReport(reportId: string) {
    const { data } = await apiClient.get<ApiResponse<Report>>(API_ENDPOINTS.reports.detail(reportId));
    return data.data;
  },

  async extractText(reportId: string) {
    const { data } = await apiClient.post<ApiResponse<{ reportId: string; extractedText: string }>>(
      API_ENDPOINTS.ocr.extract(reportId),
    );
    return data.data;
  },

  async analyzeReport(reportId: string) {
    const { data } = await apiClient.post<ApiResponse<AnalyzeReportResponse>>(
      API_ENDPOINTS.ai.analyze(reportId),
    );
    return analyzeResponseToView(data.data);
  },

  toAnalysisView(report: Report) {
    return report.analysis ? storedAnalysisToView(report.id, report.analysis) : null;
  },
};
