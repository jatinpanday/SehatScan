import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { ExternalLink } from "lucide-react";
import { queryClient } from "@/api/queryClient";
import { AnalysisCard } from "@/components/common/AnalysisCard";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer } from "@/components/layout/PageContainer";
import { queryKeys } from "@/constants/queryKeys";
import { reportService } from "@/services/report.service";
import { useAppSelector } from "@/store/hooks";

export default function ReportAnalysisPage() {
  const { t } = useTranslation();
  const { reportId = "" } = useParams();
  const userId = useAppSelector((state) => state.user.profile?.id);

  const report = useQuery({
    queryKey: userId && reportId ? queryKeys.reports.detail(userId, reportId) : queryKeys.reports.all,
    queryFn: () => reportService.getReport(reportId),
    enabled: Boolean(userId && reportId),
  });

  const extract = useMutation({
    mutationFn: reportService.extractText,
    onSuccess: async () => {
      toast.success("Text extracted");
      if (userId) {
        await queryClient.invalidateQueries({ queryKey: queryKeys.reports.list(userId) });
        await queryClient.invalidateQueries({ queryKey: queryKeys.reports.detail(userId, reportId) });
      }
    },
  });

  const analyze = useMutation({
    mutationFn: reportService.analyzeReport,
    onSuccess: async () => {
      toast.success("Analysis generated");
      if (userId) {
        await queryClient.invalidateQueries({ queryKey: queryKeys.reports.list(userId) });
        await queryClient.invalidateQueries({ queryKey: queryKeys.reports.detail(userId, reportId) });
      }
    },
  });

  const handleAnalyze = async () => {
    await extract.mutateAsync(reportId);
    await analyze.mutateAsync(reportId);
  };

  const persistedAnalysis = report.data ? reportService.toAnalysisView(report.data) : null;
  const activeAnalysis = analyze.data ?? persistedAnalysis;
  const isBusy = extract.isPending || analyze.isPending;

  return (
    <PageContainer
      title={t("analysis.title")}
      subtitle={report.data?.originalFileName ?? (reportId ? `Report ID: ${reportId}` : "Select a report to analyze.")}
      action={
        <div className="flex flex-wrap gap-2">
          {report.data?.fileUrl ? (
            <Button asChild variant="outline">
              <a href={report.data.fileUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4" />
                View report
              </a>
            </Button>
          ) : null}
          <Button onClick={handleAnalyze} disabled={!reportId || isBusy}>
            {isBusy ? t("common.loading") : activeAnalysis ? "Re-run analysis" : t("analysis.start")}
          </Button>
        </div>
      }
    >
      {report.isLoading ? <LoadingSpinner className="min-h-[320px]" /> : null}
      {report.isError ? (
        <ErrorState
          title="Report could not be loaded"
          description="The report may have been removed or you may not have access to it."
          onRetry={() => void report.refetch()}
        />
      ) : null}
      {activeAnalysis ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("analysis.summary")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-7 text-muted-foreground">{activeAnalysis.summary}</p>
            </CardContent>
          </Card>
          <section>
            <h2 className="mb-3 text-lg font-semibold">{t("analysis.findings")}</h2>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {activeAnalysis.findings.map((finding, index) => (
                <AnalysisCard key={`${finding.label}-${index}`} finding={finding} />
              ))}
            </div>
          </section>
          <Card>
            <CardHeader>
              <CardTitle>{t("analysis.recommendations")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                {activeAnalysis.recommendations.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {activeAnalysis.disclaimer ? (
                <p className="mt-5 border-t pt-4 text-xs text-muted-foreground">{activeAnalysis.disclaimer}</p>
              ) : null}
            </CardContent>
          </Card>
        </div>
      ) : !report.isLoading && !report.isError ? (
        <EmptyState
          title="Analysis is ready to run"
          description="Start extraction and AI analysis after uploading a report."
          actionLabel={t("analysis.start")}
          onAction={handleAnalyze}
        />
      ) : null}
    </PageContainer>
  );
}
