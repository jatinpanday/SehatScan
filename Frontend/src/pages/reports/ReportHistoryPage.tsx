import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ReportCard } from "@/components/common/ReportCard";
import { PageContainer } from "@/components/layout/PageContainer";
import { queryKeys } from "@/constants/queryKeys";
import { ROUTES } from "@/constants/routes";
import { reportService } from "@/services/report.service";
import { useAppSelector } from "@/store/hooks";

export default function ReportHistoryPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userId = useAppSelector((state) => state.user.profile?.id);
  const reports = useQuery({
    queryKey: userId ? queryKeys.reports.list(userId) : queryKeys.reports.all,
    queryFn: reportService.getReports,
    enabled: Boolean(userId),
    retry: false,
  });

  return (
    <PageContainer title={t("reports.historyTitle")} subtitle="All uploaded reports and their AI analysis status.">
      {reports.isLoading ? <LoadingSpinner className="min-h-[320px]" /> : null}
      {reports.isError ? (
        <ErrorState
          title="Report history could not be loaded"
          description="Please check your connection and try again."
          onRetry={() => void reports.refetch()}
        />
      ) : null}
      {reports.data?.length ? (
        <div className="space-y-3">
          {reports.data.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      ) : null}
      {reports.data && reports.data.length === 0 ? (
        <EmptyState
          title={t("reports.empty")}
          description="Upload your first health report to build a longitudinal history."
          actionLabel={t("reports.upload")}
          onAction={() => navigate(ROUTES.uploadReport)}
        />
      ) : null}
    </PageContainer>
  );
}
