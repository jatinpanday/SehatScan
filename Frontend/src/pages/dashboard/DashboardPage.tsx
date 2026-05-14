import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Activity, AlertTriangle, FileText, Sparkles, Upload } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/common/EmptyState";
import { ReportCard } from "@/components/common/ReportCard";
import { PageContainer } from "@/components/layout/PageContainer";
import { queryKeys } from "@/constants/queryKeys";
import { ROUTES } from "@/constants/routes";
import { reportService } from "@/services/report.service";
import { useAppSelector } from "@/store/hooks";

export default function DashboardPage() {
  const { t } = useTranslation();
  const userId = useAppSelector((state) => state.user.profile?.id);
  const reports = useQuery({
    queryKey: userId ? queryKeys.reports.list(userId) : queryKeys.reports.all,
    queryFn: reportService.getReports,
    enabled: Boolean(userId),
  });
  const reportList = reports.data ?? [];
  const stats = [
    { key: "dashboard.uploaded", value: String(reportList.length), icon: FileText },
    { key: "dashboard.analyzed", value: String(reportList.filter((report) => report.hasAnalysis).length), icon: Sparkles },
    { key: "dashboard.attention", value: String(reportList.filter((report) => report.status === "failed").length), icon: AlertTriangle },
  ];

  return (
    <PageContainer
      title={t("dashboard.title")}
      subtitle={t("dashboard.subtitle")}
      action={
        <Button asChild>
          <Link to={ROUTES.uploadReport}>
            <Upload className="h-4 w-4" />
            {t("nav.upload")}
          </Link>
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.key}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t(stat.key)}</CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            {t("dashboard.recent")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reportList.length ? (
            <div className="space-y-3">
              {reportList.slice(0, 4).map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          ) : (
            <EmptyState
              title={t("reports.empty")}
              description="Upload a report to begin OCR extraction and AI analysis."
              actionLabel={t("reports.upload")}
              onAction={() => {
                window.location.href = ROUTES.uploadReport;
              }}
            />
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
